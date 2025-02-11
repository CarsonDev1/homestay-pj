/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PartnerDashboardPage from "./PartnerDashboard.Page";
import { useDispatch } from "react-redux";
import { getAllBooking, getAllReviews, getDataChart } from "../Partner.Api";
import secureLocalStorage from "react-secure-storage";

const PartnerDashboardContainer = () => {
  const id = secureLocalStorage.getItem("hotelId");
  const dispatch = useDispatch();

  const init = async () => {
    await Promise.all([
      getDataChart(id, dispatch),
      getAllBooking(id, dispatch),
      getAllReviews(id, dispatch),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return <PartnerDashboardPage />;
};

export default PartnerDashboardContainer;
