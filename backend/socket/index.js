const Chat = require('../models/Chat');
const User = require('../models/User');
const ChatSetting = require('../models/ChatSetting');
const sendEmail = require('../utils/sendEmail');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`.blue);

    // --- RECURSIVE HELPERS ---
    const findDeepMatch = (items, text) => {
        const normalizedInput = text.toLowerCase().trim();
        for (const item of items) {
          const trigger = (item.value || '').toLowerCase().trim();
          const label = (item.label || '').toLowerCase().trim();
          
          if (trigger === normalizedInput || label === normalizedInput) return item;
          
          if (item.followUps && item.followUps.length > 0) {
            const found = findDeepMatch(item.followUps, text);
            if (found) return found;
          }
        }
        return null;
    };

    socket.on('join_chat', async (visitorId) => {
      socket.join(visitorId);
      const chat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
      if (chat) socket.emit('chat_history', chat.messages);
    });

    socket.on('admin_join', () => {
      socket.join('admin_room');
      Chat.find({ status: { $ne: 'closed' } }).sort({ lastMessageAt: -1 }).then(chats => {
        socket.emit('active_chats_initial', chats);
      });
    });

    socket.on('update_visitor_info', async (data) => {
      const { visitorId, name, phone, email, message } = data;
      let chat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
      
      const isNewChat = !chat;
      if (!chat) chat = new Chat({ visitorId, messages: [] });

      if (name) chat.name = name;
      if (phone) chat.phone = phone;
      if (email) chat.email = email;
      if (message) chat.messages.push(message);
      
      chat.lastMessageAt = new Date();
      await chat.save();
      
      io.to('admin_room').emit('chat_updated', chat);

      // Email Notification for New Leads
      if (isNewChat && chat.name && (chat.phone || chat.email)) {
          console.log(`[Email] New chat lead notification for: ${chat.name}`);
          const adminUrl = process.env.ADMIN_PANEL_URL || 'http://localhost:3000/dashboard/chat/live';
          const emailHtml = `
            <h2>New Chat Lead: ${chat.name}</h2>
            <p><strong>Phone:</strong> ${chat.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${chat.email || 'N/A'}</p>
            <p><a href="${adminUrl}">Go to Admin Panel to respond</a></p>
          `;
          try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL || 'admin@tridevlabels.com',
                subject: '🚀 New Chat Lead | Tridev Labels',
                message: `New lead from ${chat.name}. Phone: ${chat.phone}.`,
                html: emailHtml
            });
          } catch(e) { console.error("Email notify error:", e); }
      }
    });

    socket.on('send_message', async (data) => {
      const { visitorId, text, sender, isAdmin, adminId } = data;
      const chat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
      if (!chat) return;

      const newMessage = { sender, text, isAdmin, timestamp: new Date() };
      chat.messages.push(newMessage);
      chat.lastMessageAt = new Date();
      await chat.save();

      io.to(visitorId).emit('receive_message', newMessage);
      io.to('admin_room').emit('chat_updated', chat);

      // --- AUTOMATION: FAQ & Commands ---
      
      if (isAdmin) {
          // Check for Admin Efficiency Commands (Recursive)
          try {
              const cmdSettings = await ChatSetting.findOne({ key: 'admin_commands' });
              if (cmdSettings?.value) {
                  const matched = cmdSettings.value.find(c => c.label.toLowerCase().trim() === text.toLowerCase().trim());
                  if (matched) {
                      const botMsg = { sender: 'bot', text: matched.value, timestamp: new Date() };
                      chat.messages.push(botMsg);
                      await chat.save();
                      io.to(visitorId).emit('receive_message', botMsg);
                      io.to('admin_room').emit('chat_updated', chat);
                  }
              }
          } catch (e) {}
      } else {
          // Check for Visitor FAQs (Recursive)
          try {
              const settings = await ChatSetting.findOne({ key: 'visitor_faqs' });
              if (settings?.value) {
                  const matchedFaq = findDeepMatch(settings.value, text);
                  if (matchedFaq) {
                      io.to(visitorId).emit('bot_typing', { isTyping: true });
                      setTimeout(async () => {
                          const botText = matchedFaq.answer || "";
                          if (botText) {
                            const botMsg = { 
                                sender: 'bot', 
                                text: botText.replace('{name}', chat.name || 'there'), 
                                timestamp: new Date() 
                            };
                            const freshChat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
                            if (freshChat) {
                                freshChat.messages.push(botMsg);
                                await freshChat.save();
                                io.to(visitorId).emit('receive_message', botMsg);
                                io.to('admin_room').emit('chat_updated', freshChat);
                            }
                          }

                          // If it has follow-ups, push new quick replies
                          if (matchedFaq.followUps?.length > 0) {
                              io.to(visitorId).emit('new_quick_replies', matchedFaq.followUps);
                          }
                          
                          io.to(visitorId).emit('bot_typing', { isTyping: false });
                      }, 1000);
                  }
              }
          } catch (e) {}
      }
    });

    socket.on('admin_claim', async ({ visitorId, adminId }) => {
      const chat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
      if (chat) {
        chat.assignedTo = adminId;
        chat.status = 'active';
        await chat.save();
        io.to('admin_room').emit('chat_updated', chat);
      }
    });

    socket.on('close_chat', async ({ visitorId, adminId }) => {
      const chat = await Chat.findOne({ visitorId, status: { $ne: 'closed' } });
      if (chat) {
        chat.status = 'closed';
        await chat.save();
        io.to(visitorId).emit('chat_closed');
        io.to('admin_room').emit('chat_updated', chat);
      }
    });

    // Typing Indicators
    socket.on('visitor_typing', ({ visitorId }) => {
        socket.to('admin_room').emit('visitor_typing', { visitorId });
    });
    socket.on('visitor_stop_typing', ({ visitorId }) => {
        socket.to('admin_room').emit('visitor_stop_typing', { visitorId });
    });
    socket.on('admin_typing', ({ visitorId }) => {
        socket.to(visitorId).emit('admin_typing', { isTyping: true });
    });
    socket.on('admin_stop_typing', ({ visitorId }) => {
        socket.to(visitorId).emit('admin_typing', { isTyping: false });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`.red);
    });
  });
};

module.exports = socketHandler;
