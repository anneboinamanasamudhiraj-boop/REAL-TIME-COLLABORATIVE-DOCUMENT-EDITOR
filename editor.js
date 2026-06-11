import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");

  useEffect(() => {
    // Existing document load
    socket.on("load-document", (data) => {
      setText(data);
    });

    // Receive changes from other users
    socket.on("receive-changes", (data) => {
      setText(data);
    });

    return () => {
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;

    setText(value);

    // Send changes to server
    socket.emit("send-changes", value);
  };

  return (
    <textarea
      rows="20"
      cols="80"
      value={text}
      onChange={handleChange}
      placeholder="Start typing..."
    />
  );
}

export default Editor;