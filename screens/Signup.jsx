import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import axios from "axios";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
import Picker from "../components/auth/Picker";
import Loader from "../components/auth/Loader";
import { baseUrl } from "../utils/IP";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
// import * as ImagePicker from "react-native-image-picker";
const Signup = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [inputs, setInput] = useState({
    username: "",
    email: "",
    password: "",
    gender: "Male",
    address: "",
    fullName: "",
    phone: "",
    status: true,
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    const { email, password, username, address, fullName, phone, gender } =
      inputs;

    if (!email) {
      handleError("Email is required", "email");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      handleError("Provide a valid email", "email");
      valid = false;
    }

    if (!password) {
      handleError("Password is required", "password");
      valid = false;
    } else if (password.length < 8) {
      handleError("At least 8 characters are required", "password");
      valid = false;
    }

    if (!username) {
      handleError("Username is required", "username");
      valid = false;
    } else if (username.length < 3) {
      handleError("At least 3 characters are required", "username");
      valid = false;
    }

    if (!fullName) {
      handleError("Full name is required", "fullName");
      valid = false;
    } else if (fullName.length < 3) {
      handleError("At least 3 characters are required", "fullName");
      valid = false;
    }

    if (!address) {
      handleError("Address is required", "address");
      valid = false;
    }

    if (!phone) {
      handleError("Phone is required", "phone");
      valid = false;
    } else if (!phone.match(/^[0-9]{10,12}$/)) {
      handleError("Provide a valid phone number", "phone");
      valid = false;
    }

    if (!gender) {
      handleError("Gender is required", "gender");
    }

    if (valid) {
      register();
    }
  };

  const register = async () => {
    setLoader(true);
    try {
      const endpoint = `${baseUrl}/user/register`;
      const data = { ...inputs };
      console.log(data);

      const response = await axios.post(endpoint, data);
      console.log("response sign up: ", response);

      if (response.status === 200) {
        setResponseData(response.data.message);
        Alert.alert("Success Register", response.data.message);
        navigation.replace("Login");
      } else {
        setResponseData(response.data.message);
        console.log(response);
        Alert.alert("Success Register", response.data.message);
      }
    } catch (error) {
      if (error.response.status === 400) {
        Alert.alert("Error", error.response.data.message);
        setLoader(false);
      } else {
        Alert.alert("Error", error.data.message);
        setLoader(false);
      }
    }
  };

  const handleChanges = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <Loader visible={loader} />
        <KeyboardAvoidingView>
          <View>
            <BackButton onPress={() => navigation.goBack()} />
            <Image
              source={require("../assets/images/bk.png")}
              style={styles.img}
            />
            <Text style={styles.motto}>Sign up and start shopping</Text>

            <Input
              placeholder="Username"
              label="Username"
              error={errors.username}
              onFocus={() => handleError(null, "username")}
              onChangeText={(text) => handleChanges(text, "username")}
            />

            <Input
              placeholder="Enter email"
              label="Email"
              error={errors.email}
              onFocus={() => handleError(null, "email")}
              onChangeText={(text) => handleChanges(text, "email")}
            />

            <Input
              placeholder="Full Name"
              label="Full Name"
              error={errors.fullName}
              onFocus={() => handleError(null, "fullName")}
              onChangeText={(text) => handleChanges(text, "fullName")}
            />

            <Picker
              selectedValue={inputs.gender}
              onValueChange={(itemValue, itemIndex) =>
                handleChanges(itemValue, "gender")
              }
              items={["Male", "Female", "Other"]}
              label="Gender"
              error={errors.gender}
            />

            <Input
              placeholder="Address"
              label="Address"
              error={errors.address}
              onFocus={() => handleError(null, "address")}
              onChangeText={(text) => handleChanges(text, "address")}
            />

            <Input
              placeholder="Phone"
              label="Phone"
              error={errors.phone}
              onFocus={() => handleError(null, "phone")}
              onChangeText={(text) => handleChanges(text, "phone")}
            />

            <Input
              placeholder="Password"
              icon="lock-outline"
              label="Password"
              error={errors.password}
              onFocus={() => handleError(null, "password")}
              onChangeText={(text) => handleChanges(text, "password")}
              password={true}
            />

            <Button title="SIGN UP" onPress={validate} />
            <Text style={styles.registered} onPress={() => navigation.goBack()}>
              Already have an account? Login
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  scroll: {
    // paddingTop: 30,
    paddingHorizontal: 20,
  },
  inputView: {
    marginHorizontal: 20,
  },
  registered: {
    marginTop: 10,
    color: COLORS.black,
    textAlign: "center",
  },
  img: {
    height: SIZES.height / 3,
    width: SIZES.width - 60,
    resizeMode: "contain",
    marginBottom: SIZES.xxLarge,
  },

  motto: {
    marginBottom: 20,
    fontFamily: "bold",
    textAlign: "center",
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
  },
});
