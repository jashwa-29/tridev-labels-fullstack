import Header from '@/components/layout/Header';
import CursorFollower from '@/components/layout/CursorFollower';
import FooterSection from '@/components/layout/FooterSection';
import ScrollToTop from '@/components/common/ScrollToTop';
import ChatWidget from '@/components/ChatWidget';
import WhatsAppFloating from '@/components/common/WhatsAppFloating';

export default function PublicLayout({ children }) {
  return (
    <>
      {/* <CursorFollower /> */}
      <Header />
      <ScrollToTop />
      <main>
        {children}
      </main>
      <WhatsAppFloating />
      <ChatWidget />
      <FooterSection />
    </>
  );
}
