import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { privateApi } from '../api';
import { orderUrl } from '../api/endpoints';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [links, setLinks] = useState([]);
  const [dripfeed, setDripfeed] = useState(1);
  const [refresh, setRefresh] = useState(true);

  const fetchOrders = useCallback(async (dripfeed) => {
    try {
      const { orders } = (
        await privateApi.get(`${orderUrl}/dripfeed/${dripfeed}`)
      ).data;

      const links = orders.map((order) => order.links.split('\n')).flat();
      setLinks(links);
      setOrders(orders);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchOrders(dripfeed);
      setRefresh(false);
    }
  }, [refresh, fetchOrders, dripfeed]);

  const handleChange = async (e) => {
    const dripfeed = e.target.value;
    fetchOrders(dripfeed);
    setDripfeed(dripfeed);
  };

  const handleRefresh = async () => {
    setRefresh(true);
  };

  const handleProcess = async () => {
    const orderIds = orders.map((order) => order._id);
    if (orderIds.length === 0) {
      return toast.info('No links to process');
    }

    try {
      await privateApi.post(`${orderUrl}/process`, { orderIds });
      setLinks([]);
      setOrders([]);
      toast.success('Links processed');
    } catch (err) {
      toast.error(err.response.data.err || err.response.data.message);
    }
  };

  const handleCopy = () => {
    toast.info('Links copied');
  };

  return (
    <div className="container">
      <div className="mt-3 mx-auto">
        <label htmlFor="dripfeed" className="form-label">
          Dripfeed
        </label>
        <select
          className="form-select"
          aria-label="Dripfeed"
          onChange={handleChange}
          value={dripfeed}
        >
          <option selected>Select a number</option>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>

        <div className="col-4">
          <button
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
            onClick={handleProcess}
          >
            Process
          </button>
        </div>

        <div className="mt-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="h3 me-3">Links</div>
              <img
                style={{ cursor: 'pointer' }}
                src="/refresh.svg"
                alt="refresh"
                onClick={handleRefresh}
              />
            </div>
            <CopyToClipboard text={links} onCopy={handleCopy}>
              <button className="btn btn-primary">Copy</button>
            </CopyToClipboard>
          </div>
          <div
            style={{
              lineHeight: '0.9rem',
              fontSize: '13px',
              fontFamily: 'monospace',
              position: 'relative',
              border: '1px solid #000',
            }}
            className="p-2 mt-2"
          >
            {React.Children.toArray(links.map((link) => <div>{link}</div>))}
          </div>
        </div>
      </div>
    </div>
  );
}
