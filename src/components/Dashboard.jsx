import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { privateApi } from '../api';
import { orderUrl } from '../api/endpoints';
import Search from './Search';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [links, setLinks] = useState([]);

  const handleChange = async (e) => {
    try {
      const { orders } = (
        await privateApi.get(`${orderUrl}/dripfeed/${e.target.value}`)
      ).data;

      const links = orders.map((order) => order.links.split('\n')).flat();
      setLinks(links);
      setOrders(orders);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProcess = async () => {
    const orderIds = orders.map((order) => order._id);
    if (orderIds.length === 0) {
      return toast.info('No links to process');
    }

    try {
      await privateApi.post(`${orderUrl}/process`, { orderIds });
      toast.success('Current orders processed');
    } catch (err) {
      toast.error(err.response.data.err || err.response.data.message);
    }
  };

  return (
    <div className="row">
      <div className="col-8">
        <div className="mt-3 mx-auto" style={{ maxWidth: '90%' }}>
          <div className="row align-items-center">
            <div className="col-8">
              <label htmlFor="dripfeed" className="form-label">
                Dripfeed
              </label>
              <select
                className="form-select"
                aria-label="Dripfeed"
                onChange={handleChange}
              >
                <option selected>Select a number</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <button
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
                onClick={handleProcess}
              >
                Process
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3>Links</h3>
            <div
              style={{
                lineHeight: '0.9rem',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            >
              {React.Children.toArray(links.map((link) => <div>{link}</div>))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="container mt-4">
          <Search />
        </div>
      </div>
    </div>
  );
}
