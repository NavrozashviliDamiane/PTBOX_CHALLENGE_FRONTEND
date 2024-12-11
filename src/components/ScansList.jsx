import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ScansList.css";

const ScansList = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 9; 

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get(
          "https://pitboxosint-production.up.railway.app/api/scans"
        );
        // Sort scans by endTime descending (newest first)
        const sortedScans = response.data.sort(
          (a, b) => new Date(b.endTime) - new Date(a.endTime)
        );
        setScans(sortedScans);
      } catch (error) {
        console.error("Error fetching scans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  if (loading) {
    return <p>Loading scans...</p>;
  }

  // Calculate pagination values
  const totalItems = scans.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentScans = scans.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="scans-container">
      <h1>Scan List</h1>

      <div className="cards-grid">
        {currentScans.map((scan) => (
          <div className="card" key={scan.id}>
            <div className="card-header">
              <span 
                className="card-status" 
                status={scan.status === "completed" ? "completed" : "in-progress"}
              >
                {scan.status === "completed" ? "Completed" : "In Progress"}
              </span>
            </div>
            <div className="card-body">
              {/* Make the domain clickable to go to details */}
              <h3>
                <Link to={`/scans/${scan.id}`}>
                  {scan.domain}
                </Link>
              </h3>
              <p>Tool: {scan.tool}</p>
              <p>End Time: {new Date(scan.endTime).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          &laquo; Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default ScansList;
