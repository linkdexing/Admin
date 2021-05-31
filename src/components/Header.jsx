import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ loggedIn, setLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('linkdexing_admin_token');
    setLoggedIn(false);
  };

  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg"
      style={{ minHeight: 80, fontSize: 20 }}
    >
      <div className="container-fluid">
        {' '}
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
        {loggedIn ? (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link active"
                  aria-current="page"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/users"
                  className="nav-link active"
                  aria-current="page"
                >
                  Manage Users
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav mc-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="btn btn-danger nav-link active"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
