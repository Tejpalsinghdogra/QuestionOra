import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './layout.css';

function Layout() {
  const location = useLocation();

  useEffect(() => {
    const scrollElements = document.querySelectorAll('.scroll-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.5
    });

    scrollElements.forEach(el => observer.observe(el));

    // Cleanup observer on unmount or path change
    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
    };
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <div className="containerh">
          <div id="fh">"QuestionOra - Your Gateway to Past Papers"</div>
        </div>
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
