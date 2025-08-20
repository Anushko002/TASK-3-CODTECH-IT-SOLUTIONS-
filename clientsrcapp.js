import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io(); // auto-connect to same server

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("load-document", (doc) => {
      setText(doc);
    });

    socket.on("receive-changes", (delta) => {
      setText(delta);
    });

    return () => {
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    socket.emit("send-changes", value);
  };

  return (
    <div className="App">
      <h2>📝 Collaborative Document Editor</h2>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;
