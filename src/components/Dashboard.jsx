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

  // Messages to cycle through while scanning
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
    if (scanResult.status === "scanning") {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) =>
          (prevIndex + 1) % scanningMessages.length
        );
      }, 2000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [scanResult.status, scanningMessages.length]);

  const handleNewScanResult = (result) => {
    try {
      const parsedResult = JSON.parse(result);
      setScanResult(parsedResult);
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

      <WebSocketComponent onNewMessage={handleNewScanResult} />

      {scanResult.domain ? (
        scanResult.status === "in_progress" ? (
          <>
            <h2>Scanning {scanResult.domain}</h2>
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>{scanningMessages[currentMessageIndex]}</p>
            </div>
          </>
        ) : (
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
        )
      ) : (
        <h2>
          Trust me our fingers are really bored!! give us domain -will show you something hidden ;)
        </h2>
      )}

      <DataTable scanResult={dataToDisplay} />
    </div>
  );
};

export default Dashboard;
