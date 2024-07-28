import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import BackButton from "../components/auth/BackButton";
import { COLORS, SIZES, images } from "../constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/IP";
import formatDate from "../utils/helper";
import { Rating } from "react-native-ratings";
const DetailOrder = ({ navigation }) => {
  const route = useRoute();
  // const navigation = useNavigation();
  const { order } = route.params;
  console.log("order:", order);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [contentFeedback, setContentFeedback] = useState("");
  const [ratingFeedback, setRatingFeedback] = useState(0);
  useEffect(() => {
    handleGetDetailOrder();
  }, []);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  const handleGetDetailOrder = async () => {
    setLoading(true);
    if (!order) {
      setError("No order ID provided");
      return;
    }
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
        `${baseUrl}/order/getOrderByOrderId/${order}`
      );
      setData(response.data);
      setLoading(false);
      console.log("order", response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch data");
      console.log("response data", error);
    } finally {
      setLoading(false);
    }
  };

  const AddFeedback = async () => {
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

      const endpoint = `${baseUrl}/feedback/addFeedback`;
      const data = {
        productId: item?.order?.product_id._id,
        userId: JSON.parse(id),
        orderId: item?.order?._id,
        content: contentFeedback,
        rating: ratingFeedback,
      };
      console.log("feedback data:", data);
      const response = await instance.post(endpoint, data);
      if (response.status === 201) {
        refetch;
        setResponseData(response.data);
        Alert.alert("Feedback add successfully");
        setModalVisible(false);
        navigation.navigate("Details", {
          product: item?.order?.product_id?._id,
        });
      }
    } catch (error) {
      console.error("Feedback error: ", error);
      Alert.alert("Failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.navigate("Orders")}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Order Information </Text>
      </View>
      <ScrollView
        style={styles.containerinfo}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.header}>Trạng thái đơn hàng</Text>
          {data?.delivery?.status ? (
            <View>
              <Text style={styles.content}>{data?.delivery?.status}</Text>
              <Text style={styles.content}>
                {formatDate(data?.delivery?.timestamp)}
              </Text>
            </View>
          ) : (
            <Text style={styles.content}>Chờ Xác Nhận</Text>
          )}
        </View>

        <View style={styles.sectionRow}>
          <View style={styles.column}>
            <Text style={styles.header}>Thông tin vận chuyển</Text>
            <Text style={styles.content}>
              Cửa hàng: {data?.order?.store_id?.storeName}
            </Text>
            <Text style={styles.content}>
              Vị trí cửa hàng: {data?.order?.store_id?.location},{" "}
              {data?.order?.store_id?.district},{" "}
              {data?.order?.store_id?.province}
            </Text>
            {data?.delivery?.shipper_id ? (
              <Text style={styles.content}>
                Thông tin shipper: {data?.delivery?.shipper_id?.shipperName} -{" "}
                {data?.delivery?.shipper_id?.phone}
              </Text>
            ) : (
              <Text style={styles.content}>
                Thông tin shipper: Chờ Xác Nhận
              </Text>
            )}
          </View>
          <View style={styles.column}>
            <Text style={styles.header}>Địa chỉ nhận hàng</Text>
            <Text style={styles.content}>
              Địa chỉ nhận hàng: {data?.order?.location}
            </Text>
            <Text style={styles.content}>
              Người đặt hàng: {data?.order?.user_id?.fullName}
            </Text>
            <Text style={styles.content}>
              Số điện thoại {data?.order?.user_id?.phone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow1}>
            <Text style={styles.header}>Thông tin sản phẩm</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Details", {
                  product: data?.order?.product_id?._id,
                })
              }
              // style={styles.checkoutBtn}
            >
              <Text style={styles.checkOutText1}>View Shop</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productRow}>
            <Image
              source={{ uri: data?.order?.product_id?.image[0] }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                Tên sản phẩm: {data?.order?.product_id?.productName}
              </Text>
              <Text style={styles.productDetails}>
                Số lượng: {data?.order?.quantity}
              </Text>
              <Text style={styles.productDetails}>
                Tổng giá: ${data?.order?.totalPrice}
              </Text>
            </View>
          </View>
          {data?.delivery?.status === "Chờ đánh giá" ? (
            <TouchableOpacity
              style={styles.containerDelivery}
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.checkoutBtn}>
                <Text style={styles.checkOutText}>Feedback</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setContentFeedback}
              value={contentFeedback}
              placeholder="Enter your feedback"
            />
            <Rating
              ratingCount={5}
              imageSize={40}
              onFinishRating={setRatingFeedback}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={AddFeedback}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DetailOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  containerinfo: {
    paddingTop: 130,
  },
  contentContainer: {
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 44,
    top: SIZES.xxLarge,
    zIndex: 999,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: "bold",
    fontWeight: "500",
    letterSpacing: 2,
    paddingTop: SIZES.small,
    marginBottom: SIZES.xSmall,
    color: COLORS.primary,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  column: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Increase bottom margin
    color: COLORS.primary, // Change text color
  },
  content: {
    fontSize: 16,
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productDetails: {
    fontSize: 14,
  },
  checkoutBtn: {
    width: 150,
    height: 40, // Increase height
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Add top margin
  },
  checkOutText: {
    fontSize: SIZES.small,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.lightWhite,
    textTransform: "uppercase",
  },
  checkOutText1: {
    fontSize: SIZES.medium,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.black,
    textTransform: "uppercase",
  },
  containerDelivery: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  button: {
    width: "45%", // Adjust width
    height: 40, // Adjust height
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 5, // Add margin between buttons
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
