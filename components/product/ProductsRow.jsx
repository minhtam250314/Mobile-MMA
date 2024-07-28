import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import ProductCardView from "../ProductViewCard";

const ProductRow = () => {
  const { data, isLoading, error } = useFetch();
  const [numItemsToShow, setNumItemsToShow] = useState(4); // Trạng thái để theo dõi số lượng sản phẩm hiện đang được hiển thị

  const loadMore = () => {
    setNumItemsToShow(numItemsToShow + 4); // Tăng số lượng sản phẩm được hiển thị lên 4
  };

  // Render các cặp sản phẩm
  const renderProductPairs = () => {
    const pairs = [];
    for (let i = 0; i < numItemsToShow && i < data?.products?.length; i += 2) {
      pairs.push(
        <View style={styles.productPair} key={i}>
          <ProductCardView item={data.products[i]} />
          {/* Kiểm tra xem có sản phẩm thứ hai trong cặp không */}
          {i + 1 < numItemsToShow && i + 1 < data?.products?.length && (
            <ProductCardView item={data.products[i + 1]} />
          )}
        </View>
      );
    }
    return pairs;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardsContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" colors={COLORS.primary} />
          ) : error ? (
            <Text>Something went south</Text>
          ) : (
            <>
              {renderProductPairs()}
              {data?.products?.length > numItemsToShow && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={loadMore}
                >
                  <Text style={styles.loadMoreText}>LOAD MORE</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: 130,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
  },
  productPair: {
    flexDirection: "row", // Hiển thị các sản phẩm trong một cặp theo hàng ngang
    justifyContent: "space-between",
    marginBottom: SIZES.medium, // Khoảng cách giữa các cặp sản phẩm
  },
  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.medium,
    marginTop: SIZES.medium,
  },
  loadMoreText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});
