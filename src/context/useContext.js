/* jshint esversion: 6 */

import {  useContext } from "react";
import  { AppContext } from './AppContext';
import { AuthContext } from "./AuthContext";
import { BookingContext } from "./BookingContext";
import { PaymentContext } from "./PaymentContext";

export const useContextex = () => useContext(AppContext);
export const useAuth = () => useContext(AuthContext);
export const useBook = () => useContext(BookingContext);
export const usePayment = () => useContext(PaymentContext);