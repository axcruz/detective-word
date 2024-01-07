// screens/InvestigationsScreen.js

import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { auth } from "../firebase/config";

import LoadingIndicator from "../components/LoadingIndicator";

import { getInvestigations } from "../utils";

import { getThemeStyles } from "../styles/theme";

const InvestigationsScreen = ({ route, navigation }) => {

    const [refreshing, setRefreshing] = useState(false);
    const [investigations, setInvestigations] = useState([]);

    const themeStyles = getThemeStyles(useColorScheme());

    useEffect(() => {
        // Fetch stack data
        if (auth.currentUser) {
            const fetchInvestigations = async () => {
                try {
                    const allInvestigations = await getInvestigations();
                    setInvestigations(allInvestigations);
                } catch (error) {
                    // Handle error
                }
            };
            fetchInvestigations();
        }
    }, [refreshing]);

    // Handle refresh for Flatlist
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // 2 second pause
    }, []);

    // Utility to render stack panels under a stack category
    const renderItem = ({ item }) => {

        return (
            <React.Fragment>
                {investigations ? (
                    <>
                        <TouchableOpacity
                            style={[
                                themeStyles.card,
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: 10,
                                    marginBottom: 2,
                                },
                            ]}
                            onPress={() => {navigation.navigate("Leads", { invId: item.id })}}
                        >
                            <Ionicons name="folder" size={24} style={themeStyles.text} />
                            <Text style={[themeStyles.titleText, { width: "80%" }]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    </>

                ) : (
                    <ActivityIndicator
                        size="large"
                        style={{ justifyContent: "center" }}
                    />
                )}
            </React.Fragment>
        );
    };

    // Main render
    return (
        <>
            {themeStyles ? (
                <View style={themeStyles.container}>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingBottom: 10,
                            marginBottom: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: "gray",
                        }}
                    >
                                    <TouchableOpacity
              style={[themeStyles.primaryButton, { marginHorizontal: 5 }]}
              onPress={() => navigation.navigate("Investigations")}
            >
              <Ionicons name="briefcase-outline" size={24} color="white" />
            </TouchableOpacity>
                    </View>

                    <FlatList
                        data={investigations}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={"gray"}
                                title="Refreshing"
                                titleColor={"gray"}
                            />
                        }
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={<View style={{ marginBottom: 10 }} />}
                        ListFooterComponent={<View style={{ marginTop: 10 }} />}
                        ListHeaderComponentStyle={{ marginTop: 5 }}
                    />
                </View>
            ) : (
                <LoadingIndicator />
            )}
        </>
    );
};

export default InvestigationsScreen;
