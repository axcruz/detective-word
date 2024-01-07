import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { getThemeStyles } from "../styles/theme";

const LoadingIndicator = () => {
  const themeStyles = getThemeStyles(useColorScheme());

  return (
    <View style={[themeStyles.container, styles.container]}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
