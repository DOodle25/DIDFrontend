// import MainNavbar from "./components/Home/MainNavbar";
// import { Outlet } from "react-router-dom";

// const App = () => {
//   return (
//     <>
//       <MainNavbar />
//       <Outlet />
//     </>
//   );
// };

// export default App;




import React, { useState, useEffect } from "react";
import MainNavbar from "./components/Home/MainNavbar";
import { Outlet } from "react-router-dom";
import axios from "axios";

const App = () => {
  const [loading, setLoading] = useState(true); // Loading state for the server
  const [error, setError] = useState(null);
  const [delayedMessage, setDelayedMessage] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Make the Axios request to the backend
        const token = localStorage.getItem("token");
        await axios.get(
          "https://didbackend.onrender.com/agepops/",
          // "https://httpbin.org/delay/20",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setLoading(false); // Server is up, stop loading
      } catch (err) {
        setError("Server is starting, please wait..."); // Server might be slow to start
        setLoading(false); // After some time, allow access even if there's an error
      }
    };

    // Check server status on component mount
    checkServerStatus();

    // Set up a 15-second timer to show a delayed message
    const timer = setTimeout(() => {
      setDelayedMessage(true);
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        {delayedMessage && (
          <p className="delayed-message">
            If it's taking more time, it means this is the first request after a while, and the server is restarting. It may take about 1 minute.
          </p>
        )}
      </div>
    ); // Render the loading screen while waiting for the server
  }

  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
};

export default App;
