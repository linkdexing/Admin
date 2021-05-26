import React from "react";

const Header = () => {
  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg"
      style={{ minHeight: 80, fontSize: 20 }}
    >
      <div className="container-fluid">
        {" "}
        <a href="/" className="navbar-brand">
          <h1>Linkdexing</h1>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a href="/" className="nav-link active" aria-current="page">
                Home
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
