import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [topic, setTopic] = useState("Technology");
  const [tone, setTone] = useState("neutral");
  const [stance, setStance] = useState("support");

  const parseSSEStream = async (reader) => {
    const decoder = new TextDecoder();
    let fullText = "";
    let prevChar = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      chunk.split("\n").forEach((line) => {
        if (line.startsWith("data:")) {
          let content = line.replace(/^data:\s*/, "");

          if (content) {
            // Fix missing space between chunks
            if (prevChar) {
              if (/^[A-Za-z0-9]$/.test(prevChar) && /^[A-Za-z0-9]/.test(content[0])) {
                content = " " + content;
              } else if (/[.?!,]$/.test(prevChar) && /^[A-Za-z]/.test(content[0])) {
                content = " " + content;
              }
            }

            // Fix missing spaces inside chunk
            content = content.replace(/([a-z])([A-Z])/g, "$1 $2");
            content = content.replace(/([.,!?])([A-Z])/g, "$1 $2");

            prevChar = content[content.length - 1];
            fullText += content;

            // Update AI message in last chat log entry
            setChatLog((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { type: "ai", message: fullText };
              return updated;
            });
          }
        }
      });
    }
  };

  const handleStart = async () => {
    const requestBody = {
      user_input: `Begin debate on ${topic} with ${tone} tone. Take a ${stance} stance.`,
      topic,
      stance,
      tone,
    };

    const response = await fetch("http://localhost:8000/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    setChatLog((prev) => [...prev, { type: "ai", message: "" }]);
    await parseSSEStream(response.body.getReader());
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setChatLog((prev) => [...prev, { type: "user", message: userInput }]);

    const requestBody = { user_input: userInput, topic, stance, tone };

    const response = await fetch("http://localhost:8000/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    setChatLog((prev) => [...prev, { type: "ai", message: "" }]);
    await parseSSEStream(response.body.getReader());

    setUserInput("");
  };

  return (
    <div className="chatbot">
      <div className="options-panel">
        <label>
          <h2>Topic:</h2>
        </label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} className="choice" />

        <label>
          <h2>Tone:</h2>
        </label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="choice">
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="humorous">Humorous</option>
          <option value="casual">Casual</option>
          <option value="aggressive">Aggressive</option>
        </select>

        <label>
          <h2>Stance:</h2>
        </label>
        <select value={stance} onChange={(e) => setStance(e.target.value)} className="choice">
          <option value="support">Support</option>
          <option value="oppose">Oppose</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      <button type="button" onClick={handleStart} className="start">
        Start
      </button>

      <div className="chatbox">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <b>{msg.type === "user" ? "You" : "AI"}:</b> {msg.message}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="user_input"
        />
        <button onClick={handleSend} className="button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;


