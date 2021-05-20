import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";

const Login = () => {
  const history = useHistory();

  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginSubmit = () => {
    const userData = {
      username,
      password,
    };

    axios
      .post("http://localhost:4000/api/v1/admin", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isSuperAdmin", true);
        history.push("/dashboard");
      });
  };

  if (localStorage.getItem("isSuperAdmin") === "true") {
    history.push("/dashboard");
  }

  return (
    <div>
      <div className="container mt-4">
        <h2>Login</h2>
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email ID"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={loginSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
