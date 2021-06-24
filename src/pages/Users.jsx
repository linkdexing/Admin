import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { privateApi } from '../api';
import { userUrl, userVariablesUrl } from '../api/endpoints';

const Users = () => {
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
      toast.error(
        err.response.data.message ||
          'Something went wrong, please try again later'
      );
    }
  };

  const handleDelete = async (email) => {
    try {
      await privateApi.delete(`${userUrl}/delete/${email}`);
      toast.error('User Deleted');
      setRefresh(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleRestrict = async (id, option) => {
    try {
      await privateApi.post(`${userVariablesUrl}/restrict/${id}`, { option });
      setRefresh(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleViewAll = () => {
    setRefresh(true);
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="search"
            placeholder="Search User"
            {...register('search', {
              required: true,
            })}
          />
          <div className="mt-2">
            <input type="submit" value="Search" className="btn btn-primary" />
            <button
              type="button"
              value="View All"
              className="btn btn-primary"
              style={{ marginLeft: '1rem' }}
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
        <table className="table table-hover table-responsive table-bordered mt-4">
          <thead className="text-center">
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">User Email</th>
              <th scope="colgroup" colSpan="3">
                Links
              </th>
              <th scope="col">RESTRICT</th>
              <th scope="col">BLOCK</th>
            </tr>
          </thead>
          <tbody style={{ whiteSpace: 'pre-wrap' }}>
            <tr className="text-center">
              <th></th>
              <th></th>
              <th>Monthly Limit</th>
              <th>Monthly Used</th>
              <th>Total Links</th>
              <th></th>
              <th></th>
            </tr>
            {React.Children.toArray(
              users.map((user) => (
                <tr
                  className={user.totalLinks >= 10000 ? 'table-danger' : null}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>{user.userVariables.monthlyLimit}</td>
                  <td>{user.userVariables.monthlyUsed}</td>
                  <td>{user.userVariables.totalLinks}</td>

                  <td>
                    {user.isRestrict ? (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => handleRestrict(user._id, false)}
                      >
                        UnRestrict
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => handleRestrict(user._id, true)}
                      >
                        Restrict
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(user.email)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
