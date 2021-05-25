import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { privateApi } from "../api";
import { userUrl } from "../api/endpoints";

const Search = () => {
  const { register, handleSubmit } = useForm();
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
      let { users } = (
        await privateApi.get(`${userUrl}/search`, {
          params: { q: values.search },
        })
      ).data;
      setUsers(users);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="search"
            placeholder="Search User"
            {...register("search", {
              required: true,
            })}
          />
          <input type="submit" value="search" className="btn btn-primary" />
        </div>
      </form>
      <div>
        <table className="table table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">USERS</th>
              <th scope="col">RESTRICT</th>
              <th scope="col">BLOCK</th>
            </tr>
          </thead>
          <tbody style={{ whiteSpace: "pre-wrap" }}>
            {users.map((user) => (
              <tr>
                <td>{user.email}</td>
                <td>
                  <button type="button" class="btn btn-warning">
                    Restrict
                  </button>
                </td>
                <td>
                  <button type="button" class="btn btn-danger">
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Search;
