import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { privateApi } from "../api";
import { userUrl } from "../api/endpoints";

const Header = () => {
  const { handleSubmit } = useForm();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let { users } = (await privateApi.get(`${userUrl}/search`)).data;
      setUsers(users);
    };
    fetchData();
  }, []);

  const onSubmit = async (values) => {
    try {
      axios.get(`${userUrl}/search`, function (req, res, next) {
        var q = req.query.q;
        setUsers
          .find(
            {
              email: {
                $regex: new RegExp(q),
              },
            },
            {
              _id: 0,
              __v: 0,
            },
            function (err, data) {
              res.json(data);
            }
          )
          .limit(10);
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg"
      style={{ minHeight: 80, fontSize: 20 }}
    >
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          Linkdexing
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
            <li className="nav-item">
              <a href="/Manage_users" className="nav-link active">
                Manage-Users
              </a>
            </li>
            <li className="nav-item">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="search"
                    placeholder="Search User"
                  />
                  <input
                    type="submit"
                    value="search"
                    className="btn btn-primary"
                  />
                </div>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
