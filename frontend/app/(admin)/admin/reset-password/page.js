import React, { Suspense } from 'react';
import ResetPasswordPage from '@/components/admin/pages/ResetPasswordPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
