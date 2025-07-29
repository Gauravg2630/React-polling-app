import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./components/Auth";
import PollList from "./components/PollList";
import CreatePoll from "./components/CreatePoll";

function App() {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/polls").then(res => setPolls(res.data));
  }, []);

  const refreshPolls = () => {
    axios.get("http://localhost:5000/api/polls").then(res => setPolls(res.data));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🗳️ Polling App</h2>
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <>
          <CreatePoll refreshPolls={refreshPolls} />
          <PollList polls={polls} refreshPolls={refreshPolls} />
        </>
      )}
    </div>
  );
}

export default App;
