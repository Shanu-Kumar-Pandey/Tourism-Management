import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

function Home() {
  const [currentText, setCurrentText] = useState('INDIA');
  const [animate, setAnimate] = useState(false);
  const texts = ['INDIA', 'भारत', 'இந்தியா', 'భారతం', 'ভারত', 'ભારત', 'ಭಾರತ', 'ഇന്ത്യ', 'ਭਾਰਤ', 'ଭାରତ'];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrentText(prevText => {
          const currentIndex = texts.indexOf(prevText);
          return texts[(currentIndex + 1) % texts.length];
        });
        setAnimate(true);
      }, 50);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Home-main">
      <div className='Home'>
        <div className="overlay"></div>
        <div className="content">
          <h1>
            Start exploring <span className={`highlight ${animate ? 'slide-down' : ''}`}>{currentText}</span>
          </h1>
          <p>
            Find great places to tour, stay, eat or visit from our partners and local experts.<br />
            Plan your trip with us now
          </p>
        </div>
      </div>

      <div className='most_visit'>
        <h2 style={{ textAlign: 'center' }}>Most Visited Place in India</h2>
        <div className="container">
          <div className="box">
            <div className="imgBx">
              <img src="././logos/1.jpg" alt="Gandhi Circuit" />
            </div>
            <div className="content">
              <div>
                <h2>Gandhi Circuit</h2>
                <p>EXPLORE</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="imgBx">
              <img src="././logos/2.webp" alt="Beaches" />
            </div>
            <div className="content">
              <div>
                <h2>Beaches</h2>
                <p>EXPLORE</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="imgBx">
              <img src="././logos/3.avif" alt="Religious Sites" />
            </div>
            <div className="content">
              <div>
                <h2>Religious Sites</h2>
                <p>EXPLORE</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="imgBx">
              <img src="././logos/4.jpg" alt="Heritage Sites" />
            </div>
            <div className="content">
              <div>
                <h2>Heritage Sites</h2>
                <p>EXPLORE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
