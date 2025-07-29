import React from "react";
import axios from "axios";

const PollList = ({ polls, refreshPolls }) => {
  const vote = id => {
    axios.post("http://localhost:5000/api/vote", { option_id: id }).then(refreshPolls);
  };

  return (
    <>
      {polls.map(p => (
        <div className="card p-3 mb-3" key={p.id}>
          <h5>{p.question}</h5>
          {p.options.map(opt => {
            const total = p.options.reduce((sum, o) => sum + o.votes, 0) || 1;
            const percent = ((opt.votes / total) * 100).toFixed(1);
            return (
              <div key={opt.id} className="d-flex align-items-center mb-2">
                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => vote(opt.id)}>Vote</button>
                <span className="me-2">{opt.text}</span>
                <div className="progress flex-grow-1">
                  <div className="progress-bar" style={{ width: `${percent}%` }}>{percent}%</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default PollList;
