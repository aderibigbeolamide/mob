'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      router.push('/');
      router.refresh();
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Logging out...</span>
        </div>
        <p className="text-muted fs-5">Logging you out...</p>
      </div>
    </div>
  );
}
