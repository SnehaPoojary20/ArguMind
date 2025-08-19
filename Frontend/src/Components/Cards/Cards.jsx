import React from 'react';
import "./Cards.css";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Cards = () => {
  return (
    <div className='cards'>
      <h1>
        Sharpen Your Mind: Learn, Debate, Evolve <br />
        Explore handpicked reads to elevate your reasoning and debating abilities.
      </h1>

      <div className="card" >
        <img src="./image1.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
           <Link to="/card1"> <h5 className="card-title"> Mastering the Art of Persuasion: 5 Timeless Debate Techniques</h5></Link>
          </div>
      </div>

      <div className="card" >
        <img src="./image2.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
          <Link to="/card2"> <h5 className="card-title"> Think Like a Philosopher: How to Build Unbreakable Arguments</h5></Link>
        </div>
      </div>

      <div className="card" >
        <img src="./image3.jpg" className="card-img-top" alt="..." />
        <div className="card-body">
          <Link to="/card3"> <h5 className="card-title">Spot the Flaws: A Beginner’s Guide to Logical Fallacies</h5></Link>
        </div>
      </div>

    
    </div>
  );
};

export default Cards;

