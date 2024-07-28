import React from "react";
import { WebView } from "react-native-webview";
import { usePayment } from "../hook/PaymentContext";
import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Thêm dòng này
import { baseUrl } from "../utils/IP";

const PaymentPage = () => {
  const { paymentUrl, setPaymentUrl } = usePayment();
  const navigation = useNavigation(); // Sử dụng useNavigation để lấy đối tượng navigation

  if (!paymentUrl) return null;

  const handleNavigationStateChange = (event) => {
    if (event.url.includes(`${baseUrl}/order/responseSucessPayPal`)) {
      // Xử lý khi trả về URL thành công
      setPaymentUrl(null);
      Alert.alert("Success", "Payment successful", [
        { text: "OK", onPress: () => navigation.navigate("Orders") }, // Thêm hành động này
      ]);
    }
    if (event.url.includes(`${baseUrl}/order/responseCancelPayPal`)) {
      // Xử lý khi người dùng hủy thanh toán
      setPaymentUrl(null);
      Alert.alert("Cancelled", "Payment was cancelled", [
        { text: "OK", onPress: () => navigation.navigate("Bottom Navigation") }, // Thêm hành động này
      ]);
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentPage;
