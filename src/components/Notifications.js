import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export default function App({ todos }) {
  const askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  const registerForPushNotifications = async () => {
    const enabled = await askPermissions();
    if (!enabled) {
      return Promise.resolve();
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  };
  const enablePushNotifications = async () => {
    let token = await registerForPushNotifications();
    if (token) {
      console.log(token);
    }
  };
  return (
    <View style={styles.container}>
      <Button
        title="Please accept Notifications Permissions"
        onPress={() => askPermissions()}
      />
      <Button
        title="Send Notification immediately"
        onPress={() => registerForPushNotifications()}
      />
      <Button
        title="Send Notification immediately"
        onPress={() => enablePushNotifications()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
