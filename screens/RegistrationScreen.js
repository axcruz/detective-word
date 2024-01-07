// screens/RegistrationScreen.js

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
import { db, auth } from "../firebase/config";

import LoadingIndicator from "../components/LoadingIndicator";

import { getThemeStyles } from "../styles/theme";

const RegistrationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const themeStyles = getThemeStyles(useColorScheme());

  const onFooterLinkPress = () => {
    navigation.navigate("Log in");
  };

  // Send Firebase Auth a registration request
  const onRegisterPress = () => {
    setLoading(true);
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        if (response.user) {
          const prefsRef = db.collection("prefs");
          prefsRef.add({
            uid: response.user.uid,
            theme: "light",
            language: "en",
          });
          navigation.navigate("Investigations");
        } else {
          alert("Unable to register user. Please try again later.");
        }
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);
  };

  return (
    <View style={themeStyles.container}>
      {loading ? (
        <LoadingIndicator />
      ) : (
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
          <TextInput
            style={[themeStyles.input, styles.input]}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
          />
          <TextInput
            style={[themeStyles.input, styles.input]}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[
              themeStyles.primaryButton,
              { marginLeft: 30, marginRight: 30, marginTop: 30, height: 48 },
            ]}
            onPress={() => onRegisterPress()}
          >
            <Text style={themeStyles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={themeStyles.subText}>
              Already have an account?{" "}
              <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                Log in
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      )}
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

export default RegistrationScreen;
