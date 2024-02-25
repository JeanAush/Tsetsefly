import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutImg from '../Assets/image4.jpg';
import Footer from './Footer';
import Final from './Final';
import HelpForm from './HelpForm';
const HelpPage = () => {
  return (
    <div>
      <Navbar/>
      <Hero
      cName="hero-mid"
      heroImg={AboutImg}
      title="Help Page"
      />
      <HelpForm/>
      <Footer/>
    </div>
  );
};

export default HelpPage;