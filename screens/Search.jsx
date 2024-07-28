import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/IP";
import SearchTile from "../components/product/SearchTile";

const Search = () => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    try {
      const encodedSearchKey = encodeURIComponent(searchKey);
      const url = `${baseUrl}/product/searchProductByName?productName=${encodedSearchKey}`;

      const response = await axios.get(url);
      setSearchResults(response.data.products);
      console.log("Search data: ", response.data.products);
    } catch (error) {
      console.error("Failed to perform search:", error);
    }
  };

  return (
    <SafeAreaView style={{ color: COLORS.lightWhite, paddingHorizontal: 20 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Feather
            style={styles.searchIcon}
            name="camera"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder="What are you looking for?"
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={SIZES.xLarge} color={COLORS.offwhite} />
        </TouchableOpacity>
      </View>
      {searchResults.length === 0 ? (
        <View style={{ flex: 1 }}>
          <Image
            source={require("../assets/images/Pose23.png")}
            style={styles.searchImage}
          />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item?._id}
          renderItem={({ item }) => <SearchTile item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },

  searchImage: {
    resizeMode: "contain",
    width: SIZES.width - 100,
    height: SIZES.height - 300,
    opacity: 0.9,
  },

  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },

  searchIcon: {
    marginRight: 10,
    marginLeft: 10,
    color: "gray",
  },
});
