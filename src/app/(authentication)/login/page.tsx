'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex">
        {/* Left Side - Medical Building Image with Branding (Desktop Only) */}
        <div 
          className="login-image-section d-none d-md-flex position-relative"
        >
          <div 
            className="w-100 h-100 position-absolute top-0 start-0"
            style={{
              backgroundImage: 'url(/medical-center-building.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div 
            className="w-100 h-100 position-absolute top-0 start-0"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.9) 0%, rgba(30, 64, 175, 0.75) 100%)',
            }}
          ></div>
          <div className="position-relative d-flex flex-column justify-content-center align-items-center text-white p-5 w-100">
            <Image
              src="/life-point-logo.png"
              alt="Life Point Medical Centre"
              width={120}
              height={120}
              className="mb-4"
            />
            <h1 className="fw-bold text-center mb-3">Life Point Medical Centre</h1>
            <p className="text-center lead mb-4">Electronic Medical Records System</p>
            <div className="text-center">
              <p className="mb-2"><i className="fas fa-shield-alt me-2"></i>Secure & Confidential</p>
              <p className="mb-2"><i className="fas fa-clock me-2"></i>24/7 Access</p>
              <p className="mb-0"><i className="fas fa-users me-2"></i>Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section d-flex align-items-center justify-content-center bg-white">
          <div className="login-form-container w-100 p-4">
            {/* Mobile Header with Logo */}
            <div className="text-center mb-4 d-md-none">
              <Image
                src="/life-point-logo.png"
                alt="Life Point Medical Centre"
                width={80}
                height={80}
                className="mb-3"
              />
              <h2 className="fw-bold mb-2" style={{ color: 'var(--lifepoint-blue)' }}>
                Life Point Medical Centre
              </h2>
              <p className="text-muted">Electronic Medical Records System</p>
            </div>

            <div className="d-none d-md-block text-center mb-4">
              <h2 className="fw-bold mb-2" style={{ color: 'var(--lifepoint-blue)' }}>
                Welcome Back
              </h2>
              <p className="text-muted">Sign in to access the EMR system</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 mb-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link href="/" className="text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <p className="small mb-2 fw-semibold">Demo Credentials:</p>
              <p className="small mb-1">
                <strong>Admin:</strong> admin@lifepointmedical.com / admin123
              </p>
              <p className="small mb-0">
                <strong>Doctor:</strong> dr.sarah@lifepointmedical.com / doctor123
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-image-section {
          width: 50%;
          flex-shrink: 0;
        }

        .login-form-section {
          flex: 1;
          overflow-y: auto;
        }

        .login-form-container {
          max-width: 500px;
          margin: 0 auto;
        }

        @media (max-width: 767.98px) {
          .login-form-section {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }

        @media (min-width: 992px) {
          .login-image-section {
            width: 45%;
          }
        }

        @media (min-width: 1200px) {
          .login-image-section {
            width: 40%;
          }
        }
      `}</style>
    </>
  );
}
