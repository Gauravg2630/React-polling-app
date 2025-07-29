import React, { useState } from "react";
import axios from "axios";

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = e => {
    e.preventDefault();
    const url = isLogin ? "/login" : "/register";
    axios.post(`http://localhost:5000/api${url}`, form).then(res => {
      if (isLogin) setUser(res.data.user);
      else alert("Registered! Now login.");
    });
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h4>{isLogin ? "Login" : "Register"}</h4>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input className="form-control my-2" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="form-control my-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="form-control my-2" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-100">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button className="btn btn-link mt-2" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Auth;
