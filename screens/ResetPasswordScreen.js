// screens/ResetPasswordScreen.js

import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { auth } from "../firebase/config";

import { getThemeStyles } from "../styles/theme";

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const themeStyles = getThemeStyles(useColorScheme());

  const onFooterLinkPress = () => {
    navigation.navigate("Log in");
  };

  // Send Firebase Auth a reset request.
  const onResetPress = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("A password reset email has been sent!");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={themeStyles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image style={styles.logo} source={require("../assets/icon.png")} />
        <TextInput
          style={[themeStyles.input, styles.input]}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[
            themeStyles.primaryButton,
            { marginLeft: 30, marginRight: 30, marginTop: 30, height: 48 },
          ]}
          onPress={() => onResetPress()}
        >
          <Text style={themeStyles.buttonText}>Reset password</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={themeStyles.subText}>
            Already reset? Back to{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 30,
    borderRadius: 50,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerLink: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
