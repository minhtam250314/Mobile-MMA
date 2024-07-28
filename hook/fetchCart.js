import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";

const fetchCart = () => {
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
        `${baseUrl}/order/getListOrder/${JSON.parse(id)}`
      );

      console.log("response", response.data);
      const newData = JSON.stringify(response.data);

      const parsedCartData = JSON.parse(newData);

      const products = parsedCartData;
      await AsyncStorage.setItem("cartCount", JSON.stringify(products.length));

      setData(products);
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

  return { data, isLoading, error, refetch, fetchData };
};

export default fetchCart;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { baseUrl } from "../utils/IP";

// const fetchCart = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const id = await AsyncStorage.getItem("id");
//       const accessToken = await AsyncStorage.getItem("accessToken");
//       if (!id || !accessToken) {
//         throw new Error("Authentication required.");
//       }

//       const instance = axios.create({
//         headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
//       });

//       const response = await instance.get(
//         `${baseUrl}/order/getListOrder/${JSON.parse(id)}`
//       );

//       console.log("response", response.data);
//       setData(response.data);
//       console.log("responsedata", data);
//       // Assuming the response.data directly contains the list of products
//       //   const products = response.data[0]?.products || []; // Adding safety check if products or first object is not present
//       //   await AsyncStorage.setItem("cartCount", JSON.stringify(products.length));

//       // Lưu tổng số lượng sản phẩm vào AsyncStorage
//       const cartItems = response.data; // Sử dụng trực tiếp mảng trả về
//       await AsyncStorage.setItem("cartCount", JSON.stringify(cartItems.length));
//     } catch (error) {
//       setError(error);
//       console.error("fetchCart error:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const refetch = () => {
//     fetchData();
//   };

//   return { data, isLoading, error, refetch };
// };

// export default fetchCart;
