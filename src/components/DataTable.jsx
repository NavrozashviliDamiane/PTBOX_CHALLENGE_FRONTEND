import React, { useState } from "react";
import "../styles/DataTable.css";

const DataTable = ({ scanResult }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Combine all the rows dynamically
  const rows = Array.from(
    {
      length: Math.max(
        scanResult.emails.length,
        scanResult.subdomains.length,
        scanResult.ipAddresses.length,
        scanResult.hostnames.length,
        scanResult.urls.length,
        scanResult.banners.length,
        scanResult.ports.length
      ),
    },
    (_, index) => ({
      id: index + 1,
      email: scanResult.emails[index] || "-",
      subdomain: scanResult.subdomains[index] || "-",
      ipAddress: scanResult.ipAddresses[index] || "-",
      hostname: scanResult.hostnames[index] || "-",
      url: scanResult.urls[index] || "-",
      banner: scanResult.banners[index] || "-",
      port: scanResult.ports[index] || "-",
    })
  );

  // Calculate the rows to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <h2>Scan Results</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Subdomain</th>
            <th>IP Address</th>
            <th>Hostname</th>
            <th>URL</th>
            <th>Banner</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.email}</td>
              <td>{row.subdomain}</td>
              <td>{row.ipAddress}</td>
              <td>{row.hostname}</td>
              <td>{row.url}</td>
              <td>{row.banner}</td>
              <td>{row.port}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
