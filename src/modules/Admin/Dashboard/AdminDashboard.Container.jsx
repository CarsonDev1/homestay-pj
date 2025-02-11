/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import AdminDashboardPage from "./AdminDashboard.Page";
import { useDispatch } from "react-redux";
import {
  getAllAccount,
  getAllPost,
  getDataBarChart,
  getDataLineChart,
  getTopUser,
} from "../Admin.Api";

const AdminDashboardContainer = () => {
  const dispatch = useDispatch();

  const init = async () => {
    await Promise.all([
      getAllPost(dispatch),
      getDataBarChart(dispatch),
      getAllAccount(dispatch),
      getTopUser(dispatch),
      getDataLineChart(dispatch),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return <AdminDashboardPage />;
};

export default AdminDashboardContainer;
