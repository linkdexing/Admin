import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { privateApi } from "../api";
import { userUrl } from "../api/endpoints";

const Search = () => {
  const { register, handleSubmit } = useForm();
  const [users, setUsers] = useState([]);

  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let { users } = (await privateApi.get(`${userUrl}/search`)).data;
      setUsers(users);
    };
    if (refresh) {
      fetchData();
      setRefresh(false);
    }
  }, [refresh]);

  const onSubmit = async (values) => {
    try {
      let { users } = (
        await privateApi.get(`${userUrl}/search`, {
          params: { q: values.search },
        })
      ).data;
      setUsers(users);
    } catch (err) {
      console.log("not found");
      toast.error(err.response.data.message);
    }
  };

  const handleDelete = async (email) => {
    try {
      await privateApi.delete(`${userUrl}/delete/${email}`);
      setRefresh(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleRestrict = async (id, option) => {
    try {
      await privateApi.post(`${userUrl}/restrict/${id}`, { option });
      setRefresh(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleViewAll = () => {
    setRefresh(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            name='search'
            placeholder='Search User'
            {...register("search", {
              required: true,
            })}
          />
          <div className='mt-2'>
            <input type='submit' value='Search' className='btn btn-primary' />
            <button
              type='button'
              value='View All'
              className='btn btn-primary'
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                handleViewAll();
              }}
            >
              View All
            </button>
          </div>
        </div>
      </form>
      <div>
        <table className='table table-hover table-responsive'>
          <thead>
            <tr>
              <th scope='col'>USERS</th>
              <th scope='col'>Total Links</th>
              <th scope='col'>RESTRICT</th>
              <th scope='col'>BLOCK</th>
            </tr>
          </thead>
          <tbody style={{ whiteSpace: "pre-wrap" }}>
            {users.map((user) => (
              <tr>
                <td>{user.email}</td>
                <td>{user.totalLinks}</td>
                <td>
                  {user.isRestrict ? (
                    <button
                      type='button'
                      className='btn btn-warning'
                      onClick={() => handleRestrict(user._id, false)}
                    >
                      UnRestrict
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='btn btn-warning'
                      onClick={() => handleRestrict(user._id, true)}
                    >
                      Restrict
                    </button>
                  )}
                </td>
                <td>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => handleDelete(user.email)}
                  >
                    Delete
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
