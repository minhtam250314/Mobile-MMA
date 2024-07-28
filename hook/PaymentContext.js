import React, { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [paymentUrl, setPaymentUrl] = useState(null);

  return (
    <PaymentContext.Provider value={{ paymentUrl, setPaymentUrl }}>
      {children}
    </PaymentContext.Provider>
  );
};
