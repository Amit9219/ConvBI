import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Footer from '../components/Landing/Footer';
import { useAuthStore } from '../store/useAuthStore';

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <main>
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
