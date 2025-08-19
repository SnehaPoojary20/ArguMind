import React, { useState,useEffect } from 'react';
import Chatbot from '../Chatbot/Chatbot';
import About from '../About/About';
import Cards from '../Cards/Cards';
import "./Home.css";

const Home = () => {
  const[score, setScore]=useState(null);
  const[loading,setLoading]=useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchScore = async () => {
    try {
      const response = await fetch("http://localhost:8000/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_reply: "Technology has significantly improved communication..."
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch score");
      }
      const data = await response.json();
      setScore(data.score);
    } catch (err) {
      console.error("Error fetching score:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchScore();
}, []);


  return (
    <div className='home'>
          <div className="welcome">
        <h1>
          <b>Welcome to ArguMind</b>
          <br />
          <br />
          <b> An AI that argues with a sharp mind.</b>
        </h1>
      </div>
        <Chatbot/>
        <br></br>
        <div className='score'>
        <h1>Your Score</h1>
        </div>
        <About/>
         <Cards/>
       <div className='closing'>
         <h1>Each argument brings clarity. <br></br>
        We hope Argumind helped you move one step closer to understanding.</h1>
       </div>
    </div>
  )
}

export default Home;
