import React from 'react';
import "./About.css";

const About = () => {
  return (
    <div className='about'>
      <h1> About ArguMind</h1>
      <h2>
       <b> AI-Powered Debate Companion</b><br></br>
Argumind is an intelligent chatbot designed to engage users in thoughtful, structured debates on a wide range of topics.
<br></br><br></br>
Customizable Debate Experience<br></br>
Users can define the topic, choose a stance (neutral, supportive, or opposing), and set the tone (formal, friendly, critical, etc.) to tailor the conversation.
<br></br><br></br>
Real-Time Interaction<br></br>
Built using React.js and FastAPI, Argumind provides dynamic and instant debate responses streamed in real-time for a seamless user experience.
<br></br><br></br>
Performance Feedback<br></br>
Argumind not only responds but also evaluates its own replies based on clarity, relevance, and persuasiveness giving users a score to reflect response quality.
<br></br><br></br>
      </h2>
    </div>
  )
}

export default About
