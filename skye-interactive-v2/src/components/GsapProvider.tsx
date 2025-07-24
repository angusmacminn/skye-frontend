'use client'

import { useEffect } from 'react';
import { initGSAP } from '@/app/lib/gsapConfig';

export default function GsapProvider() {
  useEffect(() => {
    initGSAP();
  }, []);

  return null; // This component renders nothing
}

