import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { privateApi } from '../api';
import { authUrl, userUrl, userVariablesUrl } from '../api/endpoints';

const Users = () => {
  const { register, handleSubmit } = useForm();
  const [users, setUsers] = useState([]);

  const [refresh, setRefresh] = useState(true);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const [limitValue, setLimitValue] = useState(7000);

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
      // Deletes contact from SIB
      await privateApi.delete(`${userUrl}/deleteSIB/${email}`);

      // Deletes user from Database
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

  const handleOpenModal = (index) => {
    setCurrentUserIndex(index);
    setLimitValue(users[index].userVariables.monthlyLimit);
  };

  const handleChange = (e) => {
    setLimitValue(e.target.value);
  };

  const handleEditLimit = async (id) => {
    try {
      await privateApi.post(`${authUrl}/change-limit/${id}`, {
        limit: limitValue,
      });
      toast.success('Links limit changed');
      setRefresh(true);
    } catch (err) {
      toast.error(
        err.response?.data.message ||
          'Something went wrong, please try again later'
      );
    }
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
        <table className="table table-hover table-responsive table-bordered mt-4 align-middle">
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
              users.map((user, index) => (
                <tr
                  className={
                    user.userVariables.totalLinks >= 10000
                      ? 'table-danger'
                      : null
                  }
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td className="d-flex align-items-center">
                    {user.userVariables.monthlyLimit}{' '}
                    <button
                      className="ms-auto btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalLinks"
                      onClick={() => handleOpenModal(index)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>{user.userVariables.monthlyUsed}</td>
                  <td>{user.userVariables.totalLinks}</td>

                  <td>
                    {user.userVariables.isRestrict ? (
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

      <div
        className="modal fade"
        id="ModalLinks"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Change Links Limit
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label className="form-label">New Limit</label>
              <input
                type="number"
                className="form-control"
                value={limitValue}
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleEditLimit(users[currentUserIndex]._id)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* </Modal> */}
    </div>
  );
};

export default Users;
