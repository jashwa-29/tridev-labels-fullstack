"use client";

import dynamic from 'next/dynamic';

const WhatsAppFloating = dynamic(() => import('@/components/common/WhatsAppFloating'), { ssr: false });

export default function InteractionWrappers() {
  return (
      <WhatsAppFloating />
  );
}
