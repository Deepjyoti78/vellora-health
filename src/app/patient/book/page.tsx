'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientBookPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/services');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF9]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-3 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Redirecting to healthcare services...</p>
      </div>
    </div>
  );
}
