import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/IP";
const useFetch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/product/getAllProduct`);
      setData(response.data);
      console.log("product", response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.log("error", error);
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

export default useFetch;
