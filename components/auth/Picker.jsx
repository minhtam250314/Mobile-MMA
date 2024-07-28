import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker as RNPicker } from "@react-native-picker/picker";
import { COLORS, SIZES } from "../../constants";
const Picker = ({ selectedValue, onValueChange, items, label, error }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {items.map((item, index) => (
          <RNPicker.Item label={item} value={item} key={index} />
        ))}
      </RNPicker>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "left",
  },
  picker: {
    backgroundColor: COLORS.secondary,
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  error: {
    color: COLORS.red,
    marginTop: 6,
    marginLeft: 5,
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
  },
});

export default Picker;
