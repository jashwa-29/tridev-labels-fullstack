# Reusable Modal Components Documentation

## Overview
This document describes the reusable modal and notification components created for the admin panel, ensuring consistent UI/UX across all pages.

## Components Created

### 1. Toast Component (`src/components/Toast.jsx`)
**Purpose**: Display temporary success or error notifications

**Props**:
- `type`: 'success' | 'error' (default: 'success')
- `message`: string - Message to display
- `onClose`: function (optional) - Manual close handler

**Usage**:
```jsx
import { Toast } from '@/components';

// In your component
<Toast type="success" message={successMessage} />
<Toast type="error" message={errorMessage} />
```

**Features**:
- Auto-hides when message is empty
- Fixed position (top-right)
- Smooth slide-in animation
- Green checkmark for success, red X for error

---

### 2. DeleteModal Component (`src/components/DeleteModal.jsx`)
**Purpose**: Confirm deletion actions with a professional modal

**Props**:
- `isOpen`: boolean - Controls visibility
- `onClose`: function - Close modal handler
- `onConfirm`: function - Confirm delete handler
- `title`: string (default: "Delete Item?")
- `message`: string - Confirmation message
- `itemName`: string (optional) - Name of item being deleted
- `isDeleting`: boolean (default: false) - Loading state

**Usage**:
```jsx
import { DeleteModal } from '@/components';

// State
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

// Handlers
const handleDeleteClick = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  // Delete logic here
  await deleteItem(deleteId);
  setShowDeleteModal(false);
  setDeleteId(null);
};

// Render
<DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDelete}
  title="Delete Contact?"
  message="Are you sure you want to delete this item? This action cannot be undone."
/>
```

**Features**:
- Backdrop blur effect
- Red trash icon
- Cancel and Delete buttons
- Loading state with spinner
- Click outside to close

---

### 3. SuccessModal Component (`src/components/SuccessModal.jsx`)
**Purpose**: Display success, error, or info messages in a modal format

**Props**:
- `isOpen`: boolean - Controls visibility
- `onClose`: function - Close modal handler
- `title`: string (default: "Success!")
- `message`: string - Message to display
- `type`: 'success' | 'error' | 'info' (default: 'success')

**Usage**:
```jsx
import { SuccessModal } from '@/components';

// State
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

// After successful operation
setSuccessMessage("Item created successfully!");
setShowSuccessModal(true);

// Render
<SuccessModal
  isOpen={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  title="Success!"
  message={successMessage}
  type="success"
/>
```

**Features**:
- Color-coded by type (green/red/blue)
- Appropriate icons (CheckCircle/AlertCircle)
- Single close button
- Backdrop blur effect

---

## Pages Updated

### ✅ ContactPage
- **Toast**: Success/Error notifications
- **DeleteModal**: Confirm contact deletion
- **Features**: Search, filter, AG Grid table

### ✅ QuotesPage
- **Toast**: Success/Error notifications
- **DeleteModal**: Confirm quote deletion
- **Features**: Search, filter, AG Grid table

### ✅ GalleryPage
- **Toast**: Error notifications
- **DeleteModal**: Confirm gallery item deletion
- **SuccessModal**: Show success after create/update/delete
- **Features**: Drag-and-drop reordering, image upload

### 🔄 BlogPage (To be updated)
- Needs: DeleteModal, SuccessModal
- Current: Uses window.confirm (if any)

### 🔄 BlogDetails (To be updated)
- Needs: DeleteModal, SuccessModal
- Current: Uses window.confirm (if any)

### 🔄 ServicesPage (To be updated)
- Needs: DeleteModal, SuccessModal
- Current: Uses window.confirm (if any)

---

## Implementation Pattern

### Standard Delete Flow
```jsx
// 1. State
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

// 2. Click Handler
const handleDeleteClick = (id) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};

// 3. Confirm Handler
const confirmDelete = async () => {
  if (!deleteId) return;
  try {
    await axios.delete(`${API_URL}/api/resource/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(prev => prev.filter(item => item._id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    setSuccessMessage("Item deleted successfully!");
    setShowSuccessModal(true);
  } catch (err) {
    setError("Failed to delete item.");
    setShowDeleteModal(false);
  }
};

// 4. Render
<DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDelete}
  title="Delete Item?"
  message="Are you sure? This action cannot be undone."
/>
```

### Standard Success Flow
```jsx
// 1. State
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

// 2. After Successful Operation
const handleSubmit = async () => {
  try {
    await axios.post(`${API_URL}/api/resource`, data);
    setSuccessMessage("Item created successfully!");
    setShowSuccessModal(true);
  } catch (err) {
    setError("Operation failed.");
  }
};

// 3. Render
<SuccessModal
  isOpen={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  title="Success!"
  message={successMessage}
/>
```

---

## Benefits

1. **Consistency**: All pages use the same modal designs
2. **Maintainability**: Update once, applies everywhere
3. **User Experience**: Professional, smooth animations
4. **Accessibility**: Proper focus management and keyboard support
5. **Code Reduction**: Less duplicate code across pages
6. **Flexibility**: Customizable titles and messages

---

## Migration Checklist

For each page that needs updating:

- [ ] Import components: `import { Toast, DeleteModal, SuccessModal } from '@/components';`
- [ ] Add state for modals: `showDeleteModal`, `showSuccessModal`, `successMessage`
- [ ] Replace `window.confirm()` with `handleDeleteClick()`
- [ ] Create `confirmDelete()` function
- [ ] Replace inline success toasts with `SuccessModal`
- [ ] Replace inline error toasts with `Toast` component
- [ ] Update delete button onClick to use `handleDeleteClick`
- [ ] Add modal components to JSX

---

## File Structure

```
admin-panel/src/
├── components/
│   ├── index.js          # Export all components
│   ├── Toast.jsx         # Toast notification
│   ├── DeleteModal.jsx   # Delete confirmation
│   └── SuccessModal.jsx  # Success/Error/Info modal
└── routes/Pages/
    ├── ContactPage.jsx   # ✅ Updated
    ├── QuotesPage.jsx    # ✅ Updated
    ├── GalleryPage.jsx   # ✅ Updated
    ├── BlogPage.jsx      # 🔄 Needs update
    ├── BlogDetails.jsx   # 🔄 Needs update
    └── ServicesPage.jsx  # 🔄 Needs update
```

---

## Next Steps

1. Update BlogPage with reusable modals
2. Update BlogDetails with reusable modals
3. Update ServicesPage with reusable modals
4. Test all delete and success flows
5. Ensure consistent messaging across all pages
