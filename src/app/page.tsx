'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-light bg-white shadow-sm' : 'navbar-dark'}`}>
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image src="/life-point-logo.png" alt="Life Point" width={50} height={50} className="me-2" />
            <span className="fw-bold">Life Point Medical Centre</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link" href="#services">Services</a></li>
              <li className="nav-item"><a className="nav-link" href="#insurance">Insurance</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
              <li className="nav-item ms-3">
                <Link href="/login" className="btn btn-primary px-4">
                  <i className="fas fa-sign-in-alt me-2"></i>Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="hero-section text-white py-5 position-relative" 
        style={{ 
          paddingTop: '100px', 
          minHeight: '600px',
          backgroundImage: 'url(/medical-center-building.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(30, 64, 175, 0.65) 100%)',
            zIndex: 1 
          }}
        ></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                padding: '2rem', 
                borderRadius: '0.75rem',
                backdropFilter: 'blur(5px)',
                marginBottom: '1.5rem'
              }}>
                <h1 className="hero-title fw-bold mb-4 text-white">Your Health, Our Priority</h1>
                <p className="hero-subtitle mb-0 text-white">
                  Life Point Medical Centre provides comprehensive healthcare services with cutting-edge technology and compassionate care. Your journey to better health starts here.
                </p>
              </div>
              <div className="hero-buttons d-flex flex-column flex-sm-row gap-3 mb-4">
                <Link href="/login" className="btn btn-light btn-lg px-4">
                  <i className="fas fa-calendar-check me-2"></i>Book Appointment
                </Link>
                <a href="#services" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-info-circle me-2"></i>Learn More
                </a>
              </div>
              <div className="mt-4 mt-md-5">
                <div className="row g-3 g-md-4">
                  <div className="col-4">
                    <h3 className="hero-stat fw-bold">500+</h3>
                    <p className="hero-stat-label small mb-0">Happy Patients</p>
                  </div>
                  <div className="col-4">
                    <h3 className="hero-stat fw-bold">25+</h3>
                    <p className="hero-stat-label small mb-0">Expert Doctors</p>
                  </div>
                  <div className="col-4">
                    <h3 className="hero-stat fw-bold">24/7</h3>
                    <p className="hero-stat-label small mb-0">Emergency Care</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <div className="position-relative">
                <i className="fas fa-heartbeat" style={{ fontSize: '300px', opacity: 0.2 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Our Services</h2>
            <p className="lead text-muted">Comprehensive healthcare solutions tailored to your needs</p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-user-md', title: 'General Consultation', desc: 'Expert medical consultation for all your health concerns' },
              { icon: 'fa-flask', title: 'Laboratory Services', desc: 'State-of-the-art diagnostic testing and analysis' },
              { icon: 'fa-prescription-bottle', title: 'Pharmacy', desc: 'On-site pharmacy with quality medications' },
              { icon: 'fa-heart', title: 'Cardiology', desc: 'Comprehensive heart care and monitoring' },
              { icon: 'fa-baby', title: 'Pediatrics', desc: 'Specialized care for infants and children' },
              { icon: 'fa-ambulance', title: 'Emergency Care', desc: '24/7 emergency medical services' },
            ].map((service, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm hover-lift">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className={`fas ${service.icon} fa-3x`} style={{ color: 'var(--lifepoint-blue)' }}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{service.title}</h5>
                    <p className="text-muted mb-0">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section id="insurance" className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Insurance & Payment</h2>
              <p className="lead mb-4">
                We accept multiple insurance providers to make quality healthcare accessible to everyone.
              </p>
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Accepted Insurance:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {['NHIS', 'Hygeia HMO', 'Reliance HMO', 'AXA Mansard', 'Allianz'].map((insurance, idx) => (
                    <span key={idx} className="badge bg-primary px-3 py-2">{insurance}</span>
                  ))}
                </div>
              </div>
              <p>
                <i className="fas fa-check-circle text-success me-2"></i>
                Quick insurance verification
              </p>
              <p>
                <i className="fas fa-check-circle text-success me-2"></i>
                Flexible payment options
              </p>
              <p>
                <i className="fas fa-check-circle text-success me-2"></i>
                Corporate health packages available
              </p>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <h4 className="fw-bold mb-4">Contact Our Insurance Team</h4>
                  <p className="mb-3">
                    <i className="fas fa-phone text-primary me-3"></i>
                    +234-800-LIFEPOINT
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-envelope text-primary me-3"></i>
                    insurance@lifepointmedical.com
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-clock text-primary me-3"></i>
                    Mon - Fri: 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Visit Us</h2>
            <p className="lead text-muted">We're here to serve you</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold mb-3">Location</h5>
                  <p className="mb-0">123 Medical Avenue<br />Lagos, Nigeria</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-phone fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold mb-3">Phone</h5>
                  <p className="mb-0">+234-800-LIFEPOINT<br />+234-800-5433-7646</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                  <h5 className="fw-bold mb-3">Email</h5>
                  <p className="mb-0">info@lifepointmedical.com<br />emergency@lifepointmedical.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-0">© 2025 Life Point Medical Centre. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link href="/login" className="text-white text-decoration-none me-3">Staff Portal</Link>
              <a href="#" className="text-white text-decoration-none">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 900 !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1);
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          font-weight: 400;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(0,0,0,0.1);
        }
        
        .hero-stat {
          font-size: 2rem;
          font-weight: 900 !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(0,0,0,0.1);
        }
        
        .hero-stat-label {
          font-size: 0.875rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          font-weight: 500;
        }
        
        .hero-buttons .btn {
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 991.98px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .hero-stat {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 575.98px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .hero-stat {
            font-size: 1.25rem;
          }
          
          .hero-stat-label {
            font-size: 0.75rem;
          }
          
          .hero-buttons .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
