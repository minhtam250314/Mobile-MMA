import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";

const addToCart = async (productId, storeId, price, quantity) => {
  try {
    const id = await AsyncStorage.getItem("id");
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log("accessToken", accessToken);
    console.log("userId", id);
    if (!id || !accessToken) {
      throw new Error("Authentication required.");
    }

    const instance = axios.create({
      headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
    });

    const endpoint = `${baseUrl}/order/addToCart`;
    const data = {
      product_id: productId,
      quantity: quantity,
      user_id: JSON.parse(id),
      store_id: storeId,
      price: price,
    };

    console.log("dataCart", data);
    const response = await instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("addToCart error:", error.message);
    throw error;
  }
};

export default addToCart;
