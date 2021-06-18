import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { publicApi } from '../api';

const Login = ({ setLoggedIn }) => {
  const { register, handleSubmit } = useForm();

  const loginSubmit = (values) => {
    publicApi
      .post(`/api/v1/admin`, values)
      .then((response) => {
        localStorage.setItem('linkdexing_admin_token', response.data.token);
        setLoggedIn(true);
        // history.push('/dashboard');
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            'Something went wrong, please try again later'
        );
      });
  };

  return (
    <div>
      <div className="container mt-4">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(loginSubmit)}>
          <div className="row mt-3">
            <div className="col-md-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Email ID"
                  {...register('email', {
                    required: true,
                  })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  {...register('password', {
                    required: true,
                  })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
