import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import addToCart from "../hook/addToCart";
import { StarRating } from "../components";

const ProductCardView = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Details", { product: item._id })}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image[0] }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={styles.supplier} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
          <View style={styles.ratingContainer}>
            <StarRating rating={item?.avgRating} />
            <Text style={styles.averageRatingText}>
              {item?.avgRating > 0
                ? (item?.avgRating).toFixed(1) + "/5.0"
                : "No ratings"}
            </Text>
          </View>
          <Text style={styles.totalFeedbackText}>
            {item?.reviewCount
              ? "(" + item?.reviewCount + " reviews)"
              : "(0 review)"}
          </Text>
        </View>
        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item._id, 1)}
        >
          <Ionicons name="add-circle" size={35} color={COLORS.primary} />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardView;

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 260,
    marginEnd: 10,
    marginVertical: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.secondary,
  },
  imageContainer: {
    flex: 1,
    width: 165,
    marginLeft: SIZES.medium / 2,
    marginTop: SIZES.medium / 2,
    borderRadius: SIZES.small,
    overflow: "hidden",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: SIZES.small,
  },
  detailsContainer: {
    padding: SIZES.small,
  },
  name: {
    fontSize: SIZES.large,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 1,
  },
  supplier: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  price: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.black,
  },
  addButton: {
    position: "absolute",
    bottom: SIZES.xSmall,
    right: SIZES.xSmall,
  },
  ratingContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
  },
});
