import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { privateApi } from './api';
import { authUrl } from './api/endpoints';
import { toast } from 'react-toastify';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Users from './pages/Users';
import Advertisements from './pages/Advertisements';

const PublicRoute = ({
  loggedIn,
  setLoggedIn,
  component: Component,
  ...props
}) => {
  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Route {...props} render={() => <Component setLoggedIn={setLoggedIn} />} />
  );
};

const PrivateRoute = ({ loggedIn, component: Component, ...props }) => {
  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  return <Route {...props} component={Component} />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { ok } = (await privateApi.get(`${authUrl}/me`)).data;

        if (ok) {
          setLoggedIn(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        toast.error(err.response?.data?.error || err.response?.data?.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
        <Switch>
          <PrivateRoute path="/users" component={Users} loggedIn={loggedIn} />
          <PrivateRoute
            path="/dashboard"
            component={Dashboard}
            loggedIn={loggedIn}
          />
          <PrivateRoute
            path="/advertisements"
            component={Advertisements}
            loggedIn={loggedIn}
          />
          <PublicRoute
            path="/login"
            component={Login}
            setLoggedIn={setLoggedIn}
            loggedIn={loggedIn}
          />
          <PublicRoute
            path="/"
            exact
            component={Login}
            setLoggedIn={setLoggedIn}
            loggedIn={loggedIn}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
