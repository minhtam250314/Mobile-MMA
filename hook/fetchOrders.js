import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
const fetchOrders = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const id = await AsyncStorage.getItem("id");
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!id || !accessToken) {
        throw new Error("Authentication required.");
      }

      const instance = axios.create({
        headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
      });

      const response = await instance.get(
        `${baseUrl}/order/getHistory/${JSON.parse(id)}`
      );

      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default fetchOrders;
