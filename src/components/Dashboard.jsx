import moment from "moment";
import React, { useEffect, useState } from "react";
import { privateApi } from "../api";
import { orderUrl } from "../api/endpoints";

export default function Dashboard() {
  const [links, setLinks] = useState([]);

  const handleChange = async (e) => {
    try {
      const { links } = (
        await privateApi.get(`${orderUrl}/dripfeed/${e.target.value}`)
      ).data;

      setLinks(links);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container mt-4'>
      <label htmlFor='dripfeed'>Dripfeed</label>
      <select
        className='form-select'
        aria-label='Dripfeed'
        onChange={handleChange}
      >
        <option selected>Select a number</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((value) => (
          <option value={value}>{value}</option>
        ))}
      </select>

      <div className='mt-4'>
        <h3>Links</h3>
        <ul className='list-group'>
          {React.Children.toArray(
            links.map((link) => <li className='list-group-item'>{link}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
