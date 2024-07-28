import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, SHADOWS } from "../../constants";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import useUser from "../../hook/useUser";
import { baseUrl } from "../../utils/IP";
import formatDate from "../../utils/helper";
import { usePayment } from "../../hook/PaymentContext";
import fetchCart from "../../hook/fetchCart";
import Toast from "react-native-toast-message";
// import { ScrollView } from "react-native-gesture-handler";

const CartTile = ({ item }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(item?.order?.quantity);
  const [contentLocation, setcontentLocation] = useState("");
  // const [paymentUrl, setPaymentUrl] = useState(null);
  const userLogin = useUser(navigation);
  const { setPaymentUrl } = usePayment();
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const { refetch, fetchData, data } = fetchCart();
  // const deleteCart = async () => {
  //   const endpoint = `${baseUrl}/order/deleteOrder/${item._id}`;

  //   try {
  //     await axios.delete(endpoint);
  //     await AsyncStorage.removeItem("cartCount");

  //     navigation.navigate("Cart");
  //   } catch (error) {
  //     console.error("Failed to delete cart item:", error);
  //   }
  // };
  const deleteCart = async () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${item?.order?.product_id.productName}`,
      // `Create in date ${item.timestamp}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setLoading(true);
            const id = await AsyncStorage.getItem("id");
            const accessToken = await AsyncStorage.getItem("accessToken");
            if (!id || !accessToken) {
              throw new Error("Authentication required.");
            }

            const instance = axios.create({
              headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
            });
            const endpoint = `${baseUrl}/order/deleteOrder/${item?.order?._id}`;

            try {
              await instance.delete(endpoint);
              await AsyncStorage.removeItem("cartCount");

              Toast.show({
                type: "success",
                text1: "Delete Cart sucessfull",
              });
              fetchData();
              navigation.navigate("Cart");
              setLoading(false);
            } catch (error) {
              console.error("Failed to delete cart item:", error);
              setLoading(false);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const updateCart = async () => {
    setLoading(true);
    const id = await AsyncStorage.getItem("id");
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!id || !accessToken) {
      throw new Error("Authentication required.");
    }
    try {
      const instance = axios.create({
        headers: { Authorization: `Bearer ${JSON.parse(accessToken)}` },
      });
      const data = {
        quantity: count,
        price: item?.order?.product_id?.price,
        location: contentLocation,
      };
      const endpoint = `${baseUrl}/order/updateOrder/${item?.order?._id}`;
      await instance.put(endpoint, data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async () => {
    const id = await AsyncStorage.getItem("id");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const userID = `user${JSON.parse(id)}`;
    const body = {
      user_id: JSON.parse(id),
      order_id: item?.order?._id,
      totalPrice: item.order?.totalPrice,
    };

    console.log("body", body);
    try {
      const response = await fetch(`${baseUrl}/order/payOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(accessToken)}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.url) {
        // Lưu URL thanh toán vào state và mở WebView
        setPaymentUrl(data.url);
        console.log("urlPay:", data.url);
        navigation.navigate("PaymentPage");
      } else {
        Alert.alert("Error", "Payment URL not found");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      Alert.alert("Error", error.message || "Error during payment process");
    }
  };

  // const handlePress = () => {
  //   if (userLogin) {
  //     createCheckoutSession();
  //   } else {
  //     // Navigate to the Login page when hasId is false
  //     navigation.navigate("Login");
  //   }
  // };

  const handlePress = async () => {
    if (!userLogin) {
      navigation.navigate("Login");
      return;
    }
    if (contentLocation === "") {
      Alert.alert("Error", "Gift sending address");
      return;
    }
    // Kiểm tra xem có cần cập nhật giỏ hàng không
    // if (count !== item?.order?.quantity) {
    try {
      // Cập nhật giỏ hàng trước

      await updateCart();
      // Sau khi cập nhật xong, tiếp tục với việc tạo phiên thanh toán
      await createCheckoutSession();
    } catch (error) {
      console.error(
        "Error while updating cart or creating checkout session:",
        error
      );
      Alert.alert("Error", error.message || "Error during the process");
    }
    // } else {
    //   // Nếu số lượng không thay đổi, chỉ cần tạo phiên thanh toán
    //   await createCheckoutSession();
    // }
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate("Details", {
            product: item?.order?.product_id?._id,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.order?.product_id?.image[0] }} // Giả sử image là một mảng và bạn muốn hiển thị hình đầu tiên
            resizeMode="cover"
            style={styles.productImg}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.productTxt} numberOfLines={1}>
            {item?.order?.product_id?.productName}
          </Text>
          <View style={styles.rating}>
            <TouchableOpacity onPress={() => increment()}>
              <SimpleLineIcons name="plus" size={20} color="black" />
            </TouchableOpacity>
            <Text>
              {count}/{item?.productQuantityInStore}{" "}
            </Text>
            <TouchableOpacity onPress={() => decrement()}>
              <SimpleLineIcons name="minus" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.supplierTxt} numberOfLines={1}>
            Store: {item?.order?.store_id?.storeName} -{" "}
            {item?.order?.store_id?.location}
          </Text>
          {/* <Text style={styles.supplierTxt} numberOfLines={1}>
              
              Total price= ${item?.order?.totalPrice}
            </Text> */}
          <Text style={styles.supplierTxt} numberOfLines={1}>
            Total price= $
            {item?.order?.product_id?.price && count
              ? (item.order.product_id.price * count).toFixed(2)
              : "N/A"}
          </Text>
          <Text style={styles.supplierTxt} numberOfLines={1}>
            {item?.order?.timestamp
              ? formatDate(item.order.timestamp)
              : "Không có dữ liệu thời gian"}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ paddingBottom: 20, paddingLeft: 75 }}
            onPress={() => deleteCart()}
          >
            <AntDesign name="delete" size={18} color="red" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleModal} style={styles.checkoutBtn}>
            <Text style={styles.checkOutText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView horizontal={true} style={styles.imageScrollView}>
            {item?.order?.product_id?.image?.map((img, index) => (
              <TouchableOpacity key={index}>
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text>Price: ${item?.order?.product_id?.price}</Text>
          <Text>Quantity: {count}</Text>
          <Text>Location: {item?.order?.store_id?.location}</Text>
          {/* <Text>Total Price: ${item?.order?.totalPrice}</Text> */}
          <Text>
            Total price: $
            {item?.order?.product_id?.price && count
              ? (item.order.product_id.price * count).toFixed(2)
              : "N/A"}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setcontentLocation}
            value={contentLocation}
            placeholder="Enter your location"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePress} style={styles.checkoutBtn}>
              <Text style={styles.checkOutText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.checkoutBtn}>
              <Text style={styles.checkOutText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  imageContainer: {
    width: 70,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  productTxt: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  supplierTxt: {
    fontSize: SIZES.small + 2,
    fontFamily: "regular",
    color: COLORS.gray,
    marginTop: 3,
    textTransform: "capitalize",
  },
  checkOutText: {
    paddingHorizontal: 10,
    fontSize: SIZES.small,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.lightWhite,
    textTransform: "uppercase",
  },
  checkoutBtn: {
    width: "100%",
    maxWidth: 100,
    height: "35%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  orderRow: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontFamily: "medium",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageScrollView: {
    flexDirection: "row",
    marginBottom: 10,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  rating: {
    // top: SIZES.large,
    flexDirection: "row",
    // justifyContent: "flex-end",
    // alignItems: "center",
    // marginHorizontal: SIZES.large,
  },
});
