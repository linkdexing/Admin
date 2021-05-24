import React, { useEffect, useState } from "react";
import { privateApi } from "../api";
import { orderUrl } from "../api/endpoints";
import Manage_users from "./Manage_users";

export default function Dashboard() {
  return (
    <div className="container mt-4">
      <Manage_users />
    </div>
  );
}
