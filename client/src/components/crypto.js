import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import socketIOClient from "socket.io-client"; // Import the 'socket.io-client' library

import "bootstrap/dist/css/bootstrap.min.css";

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = socketIOClient("http://localhost:5000");

    // Listen for real-time updates from the server
    socket.on("cryptoUpdate", (updatedCryptos) => {
      // Update the state with the latest data
      setCryptos(updatedCryptos);
    });

    // Fetch initial data from the backend (assuming you have an API to get crypto data)
    fetchCryptosFromBackend();

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchCryptosFromBackend = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/crypto/fetch-crypto-updates");
      setCryptos(response.data.cryptosData);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  return (
    <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
      <div class="row ">
        <div class="col-sm-3 mt-5 mb-4 text-gred">
          <div className="search">
            <form class="form-inline"></form>
          </div>
        </div>
        <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}>
          <h2>
            <b>Crypto Details</b>
          </h2>
        </div>
        <h2>Cryptocurrency Table</h2>
        <button onClick={fetchCryptosFromBackend}>Fetch Cryptocurrency Data</button>
        <div class="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred"></div>
      </div>
      <div class="row">
        <div class="table-responsive ">
        <table class="table table-striped table-hover table-bordered">
  <thead>
    <tr>
      <th>Token</th>
      <th>Symbol</th>
      <th>Price</th>
      <th>Price Change</th>
      <th>Percentage Change</th>
      <th>Last Price Change Date</th>
    </tr>
  </thead>
  <tbody> {/* Single tbody element for the table rows */}
    {cryptos.map((crypto) => (
      <tr key={crypto.id}>
        <td>{crypto.name}</td>
        <td>{crypto.symbol}</td>
        <td>
          {crypto.current_price !== undefined && !isNaN(crypto.current_price)
            ? `$${crypto.current_price.toLocaleString()}`
            : "-"}
        </td>
        <td>{moment(crypto.last_updated).format("DD/MM/YYYY")}</td>
        <td>
          {!isNaN(crypto.price_change) ? `%${crypto.price_change}` : "-"}
        </td>
        {/* Add other table cells for remaining data */}
        <td>
          {crypto.percentage_change !== undefined && !isNaN(crypto.percentage_change)
            ? crypto.percentage_change.toFixed(2)
            : "-"}
          %
        </td>
        <td>
          {crypto.last_price_change_date !== undefined
            ? moment(crypto.last_price_change_date).format("DD/MM/YYYY")
            : "-"}
        </td>
        
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
};

export default CryptoTable;
