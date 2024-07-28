import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, SHADOWS } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import formatDate from "../../utils/helper";
import { baseUrl } from "../../utils/IP";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-ratings";
import fetchOrders from "../../hook/fetchOrders";
import { useNavigation } from "@react-navigation/native";
const OrderTile = ({ item }) => {
  const [responseData, setResponseData] = useState(null);
  const [contentFeedback, setContentFeedback] = useState("");
  const [ratingFeedback, setRatingFeedback] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error, refetch } = fetchOrders();
  const navigation = useNavigation();
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
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Details-Order", {
            order: item?.order?._id,
          })
        }
        style={styles.container}
      >
        <View style={styles.containerProduct}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.order?.product_id?.image[0] }}
              resizeMode="cover"
              style={styles.productImg}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.productTxt} numberOfLines={1}>
              {item?.order?.product_id?.productName}
            </Text>
            <Text style={styles.supplierTxt} numberOfLines={1}>
              Quantity: {item?.order?.quantity}
            </Text>
            <Text style={styles.supplierTxt} numberOfLines={1}>
              Total Price: {item?.order?.totalPrice}
            </Text>
            <Text style={styles.supplierTxt} numberOfLines={1}>
              Create date:{" "}
              {item?.order?.timestamp
                ? formatDate(item.order.timestamp)
                : "Không có dữ liệu thời gian"}
            </Text>
          </View>
        </View>
        {item?.shipper?.shipperName &&
        item?.shipper?.phone &&
        item?.delivery?.status ? (
          <View style={styles.containerDelivery}>
            <View style={styles.checkoutBtn}>
              <Text style={styles.checkOutText}>{item?.delivery?.status}</Text>
            </View>

            <View style={styles.orderRow}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={16}
                color="gray"
              />
              <Text style={styles.totalText}>
                {item?.shipper?.shipperName} - {item?.shipper?.phone}{" "}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.containerDelivery}>
            <View style={styles.checkoutBtnChoXacNhan}>
              <Text style={styles.checkOutText}>Chờ xác nhận</Text>
            </View>
          </View>
        )}

        {item?.delivery?.status === "Chờ đánh giá" ? (
          <TouchableOpacity
            style={styles.containerDelivery}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.checkoutBtnFeedback}>
              <Text style={styles.checkOutText}>Feedback</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
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
    </View>
  );
};

export default OrderTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  containerProduct: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  containerDelivery: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: 200,
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
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 140,
    maxHeight: 20,
  },
  checkoutBtnChoXacNhan: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // maxWidth: 250,
    // maxHeight: 30,
  },
  checkoutBtnFeedback: {
    width: "150%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  orderRow: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontFamily: "medium",
    fontSize: SIZES.small,
    color: COLORS.gray,
    textTransform: "uppercase",
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
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 120,
    maxHeight: 20,
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
});
