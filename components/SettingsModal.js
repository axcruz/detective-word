import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
  Switch,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../firebase/config";
import { getThemeStyles } from "../styles/theme";
import getUserPrefs from "../utils/getUserPrefs";

const SettingsModal = (props) => {
  const [user, setUser] = useState();
  const [pref, setPref] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    const fetchSettings = async () => {
      setUser(auth.currentUser);
      setPref(await getUserPrefs(auth.currentUser.uid));
    }
    fetchSettings();
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLogout = () => {
    setModalVisible(false);
    auth.signOut();
  };

  const handleThemeChange = () => {};

  const themeOptions = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {user && pref ? (
        <>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={themeStyles.modalView}>
              <Text style={[themeStyles.titleText, { marginVertical: 10 }]}>
                Settings
              </Text>
              <Text style={themeStyles.text}>{pref.username}</Text>
              <Text style={themeStyles.text}>{user.email}</Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[themeStyles.configButton, { marginHorizontal: 5 }]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Ionicons name="return-down-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[themeStyles.dangerButton, { marginHorizontal: 5 }]}
                  onPress={handleLogout}
                >
                  <Text style={themeStyles.buttonText}>Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={[themeStyles.configButton, { marginHorizontal: 5 }]}
            onPress={toggleModal}
          >
            <Ionicons name="settings-sharp" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default SettingsModal;