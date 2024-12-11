import React, { useState, useEffect } from "react";
import WebSocketComponent from "./WebSocketComponent";
import DataTable from "./DataTable";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [scanResult, setScanResult] = useState({
    domain: "",
    status: "",
    result: {
      emails: [],
      subdomains: [],
      ipAddresses: [],
      hostnames: [],
      urls: [],
      banners: [],
      ports: [],
    },
  });

  // If loading is true, show spinner until first result arrives
  const [loading, setLoading] = useState(false);

  const scanningMessages = [
    "Dusting off the magnifying glass...",
    "Following digital footprints...",
    "Unraveling mysteries in the data...",
    "Brewed a cup of coffee; digging deeper...",
    "Decrypting hidden whispers of the web..."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let interval;
    // Only cycle scanning messages if loading is true
    if (loading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) =>
          (prevIndex + 1) % scanningMessages.length
        );
      }, 2000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading, scanningMessages.length]);

  const handleNewScanResult = (result) => {
    try {
      const parsedResult = JSON.parse(result);
      setScanResult(parsedResult);
      // Once we have a result, we can stop loading/spinner
      setLoading(false);
    } catch (error) {
      console.error("Error parsing scan result:", error);
    }
  };

  const emptyPlaceholder = {
    emails: Array(10).fill(""),
    subdomains: Array(10).fill(""),
    ipAddresses: Array(10).fill(""),
    hostnames: Array(10).fill(""),
    urls: Array(10).fill(""),
    banners: Array(10).fill(""),
    ports: Array(10).fill(""),
  };

  const dataToDisplay = scanResult.domain ? scanResult.result : emptyPlaceholder;

  return (
    <div>
      <div className="header">
        <h1>Scan ME</h1>
      </div>

      <WebSocketComponent
        onNewMessage={handleNewScanResult}
        onScanStarted={() => setLoading(true)} // When scan starts, show spinner
      />

      {loading ? (
        <>
          <h2>Scanning {scanResult.domain || "..."}</h2>
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>{scanningMessages[currentMessageIndex]}</p>
          </div>
        </>
      ) : scanResult.domain ? (
        <>
          <h2>Scan Results for {scanResult.domain}</h2>
          <p>Status: <strong>{scanResult.status}</strong></p>

          <div className="card-grid">
            <div className="card">
              <h3>Emails Found</h3>
              <p>{scanResult.result.emails.length}</p>
            </div>
            <div className="card">
              <h3>Subdomains Found</h3>
              <p>{scanResult.result.subdomains.length}</p>
            </div>
            <div className="card">
              <h3>IP Addresses Found</h3>
              <p>{scanResult.result.ipAddresses.length}</p>
            </div>
          </div>
        </>
      ) : (
        <h2>
          Trust me our fingers are really bored!! give us a domain - will show you something hidden ;)
        </h2>
      )}

      <DataTable scanResult={dataToDisplay} />
    </div>
  );
};

export default Dashboard;
