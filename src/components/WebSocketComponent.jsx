import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import axios from "axios";

const WebSocketComponent = ({ onNewMessage, onScanStarted }) => {
  const [socketUrl] = useState("wss://pitboxosint-production.up.railway.app/scan-progress");
  const [scanRequest, setScanRequest] = useState({ domain: "", tool: "theharvester" });

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection established."),
    onClose: () => console.log("WebSocket connection closed."),
    onError: (error) => console.error("WebSocket error:", error),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage) {
      onNewMessage(lastMessage.data);
    }
  }, [lastMessage, onNewMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Closing...",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleScanRequest = async () => {
    if (scanRequest.domain.trim() === "") {
      alert("Please enter a valid domain.");
      return;
    }

    try {
      // Notify parent that scan started (show spinner)
      onScanStarted && onScanStarted();

      await axios.post(
        "https://pitboxosint-production.up.railway.app/api/scans",
        scanRequest
      );
      alert(`Scan initiated for domain: ${scanRequest.domain}`);
    } catch (error) {
      console.error("Error starting scan:", error.response?.data || error.message);
      alert(error.response?.data || "Failed to start scan");
    }
  };

  return (
    <div style={{
      marginBottom: "20px",
      background: "#ffffff",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      padding: "20px",
      maxWidth: "400px"
    }}>
      <h3 style={{ marginTop: 0 }}>Start a New Scan</h3>
      <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: "15px" }}>
        Connection Status: <strong>{connectionStatus}</strong>
      </p>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Domain</label>
        <input
          type="text"
          placeholder="e.g., example.com"
          value={scanRequest.domain}
          onChange={(e) => setScanRequest({ ...scanRequest, domain: e.target.value })}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ced4da"
          }}
        />
      </div>
      <p style={{ fontSize: "14px", color: "#6c757d", margin: "0 0 15px 0" }}>
        Tool: <strong>theharvester</strong>
      </p>
      <button
        onClick={handleScanRequest}
        style={{
          background: "#007bff",
          color: "#ffffff",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Start Scan
      </button>
    </div>
  );
};

export default WebSocketComponent;
