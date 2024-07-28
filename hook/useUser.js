import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUser = (navigation) => {
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    const checkUserExistence = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        const accessToken = await AsyncStorage.getItem("accessToken");
        console.log("token", accessToken);
        console.log("id", id);

        const userID = `user${id ? JSON.parse(id) : "default"}`;
        const userData = await AsyncStorage.getItem(userID);

        if (userData !== null) {
          setUserLogin(true);
        } else {
          // navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    checkUserExistence();
  }, [navigation]);

  return userLogin;
};

export default useUser;
