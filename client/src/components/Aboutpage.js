import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutImg from '../Assets/image8.webp';
import Final from './Final';
import Footer from './Footer';
import AboutUs from './AboutUs';
function AboutPage() {
  return (
    <div>
      <Navbar/>
      <Hero
      cName="hero-mid"
      heroImg={AboutImg}
      title="About the Tsetse Fly Species Distribution Map"
      />
      <AboutUs/>
      <Footer/>
    </div>
  );
}

export default AboutPage;