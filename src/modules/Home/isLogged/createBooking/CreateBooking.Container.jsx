/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import BoxContainer from "../../../../components/Box/Box.Container";
import CreateBookingPage from "./CreateBooking.Page";
import { useDispatch } from "react-redux";
import {
  getAllVoucherByAccountId,
  getHotelDetails,
  getRoomDetails,
} from "../../Home.Api";
import { getProfile } from "../../../Auth/Auth.Api";
import secureLocalStorage from "react-secure-storage";

const CreateBookingContainer = () => {
  const dispatch = useDispatch();

  const init = async () => {
    await Promise.all([
      getHotelDetails(secureLocalStorage.getItem("hotelId"), dispatch),
      getRoomDetails(secureLocalStorage.getItem("roomId"), dispatch),
      getProfile(secureLocalStorage.getItem("accountId"), dispatch),
      getAllVoucherByAccountId(
        secureLocalStorage.getItem("accountId"),
        dispatch
      ),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <BoxContainer>
      <CreateBookingPage />
    </BoxContainer>
  );
};

export default CreateBookingContainer;
