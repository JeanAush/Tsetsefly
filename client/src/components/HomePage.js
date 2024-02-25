import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Final from './Final';
import Footer from './Footer';
const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Hero
      cName="hero"
      heroImg="https://media.istockphoto.com/id/139703045/photo/tsetse-fly.webp?b=1&s=170667a&w=0&k=20&c=LYzUEVyb-TdLI-Hesh-K4TtV4HNFYWgt7LAgtjaHNCQ="
      title="Welcome to the Tsetse Fly Distribution Map System"
      text="Discover and contribute to Tsetse fly research! Upload your data, visualize distribution, and join our collaborative effort for effective control strategies."
      />
      <Final/>
      <Footer/>
    </div>
  );
};

export default HomePage;