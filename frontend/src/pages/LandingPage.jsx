import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Footer from '../components/Landing/Footer';
import LandingNavbar from '../components/Landing/Navbar';
import { useAuthStore } from '../store/useAuthStore';

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <LandingNavbar />

      <main className="flex-1">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
