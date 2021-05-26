import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { privateApi } from "./api";
import { authUrl } from "./api/endpoints";
import { toast } from "react-toastify";

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
      <Header />
      {!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Dashboard />}
    </div>
  );
}

export default App;
