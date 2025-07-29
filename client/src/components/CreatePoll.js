import React, { useState } from "react";
import axios from "axios";

const CreatePoll = ({ refreshPolls }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addPoll = e => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/polls", { question, options }).then(() => {
      setQuestion("");
      setOptions(["", ""]);
      refreshPolls();
    });
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Create Poll</h5>
      <form onSubmit={addPoll}>
        <input className="form-control mb-2" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Poll question" />
        {options.map((opt, i) => (
          <input key={i} className="form-control mb-2" value={opt} onChange={e => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }} placeholder={`Option ${i + 1}`} />
        ))}
        <button type="button" className="btn btn-secondary btn-sm mb-2" onClick={() => setOptions([...options, ""])}>+ Add Option</button>
        <button className="btn btn-success w-100">Create</button>
      </form>
    </div>
  );
};

export default CreatePoll;
