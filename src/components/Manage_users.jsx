import React, { useEffect, useState } from "react";
import { privateApi } from "../api";
import { orderUrl } from "../api/endpoints";
import moment from "moment";

// group by dripfeed
// sort by (dripfeed(5) + oder_date(20) - current_date(23)) = 2
export default function Manage_users() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let { orders } = (await privateApi.get(`${orderUrl}/all`)).data;
      orders = orders.map((order) => {
        order.final_date = moment(order.createdAt).add({
          days: order.dripfeed,
        });
        order.remaining_days = Math.floor(
          moment
            .duration(moment(order.final_date).diff(moment(Date.now())))
            .asDays()
        );

        if (order.remaining_days < 0) {
          order.remaining_days = 0;
        }
        return order;
      });
      console.log(orders);
      setOrders(orders);
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-7">
          <h2>Users</h2>

          <table className="table table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">Remaining Days</th>
                <th scope="col"># of links</th>
                <th scope="col">Links</th>
                <th scope="col">Created at</th>
                <th scope="col">Progress</th>
              </tr>
            </thead>
            <tbody style={{ whiteSpace: "pre-wrap" }}>
              {React.Children.toArray(
                orders.map((order) => (
                  <tr className={order.isProcessed ? "table-success" : null}>
                    <td>{order.remaining_days}</td>
                    <td>{order.links.split("\n").length}</td>
                    <td>{order.links}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.isProcessed ? "Done" : "Pending"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* <Sidebar /> */}
      </div>
    </div>
  );
}
