import React from 'react';
import homeImage from './assets/home-image.jpg';  

const Home = () => {
   
  return (
    <div className="home-page">
      <h1 className="title">Welcome to Our Donation Platform</h1>
      <p className="subtitle">Make a difference today with your donations ...</p> 
      <img src={homeImage} alt="Home Page" className="home-image" />
      

    </div>
  );
};

export default Home;
