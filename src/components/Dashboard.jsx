import React, { useState } from "react";
import { privateApi } from "../api";
import { orderUrl } from "../api/endpoints";
import Search from "./Search";

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
    <div className="row">
      <div className="col-8">
        <div className="mt-4 mx-auto">
          <label htmlFor="dripfeed">Dripfeed</label>
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

          <div className="mt-4">
            <h3>Links</h3>
            <div
              style={{
                lineHeight: "0.9rem",
                fontSize: "13px",
                fontFamily: "monospace",
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
