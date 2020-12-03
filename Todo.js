import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Checkbox, Button } from "react-native-paper";

import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
const Todo = ({ todo }) => {
  const [{}, dispatch] = useStateValue();
  const [checked, setChecked] = useState(false);
  return (
    <View style={styles.container}>
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
        color="white"
      />
      <View style={styles.todo}>
        <Text style={checked ? styles.textinvalid : styles.textvalid}>
          {todo}
        </Text>
      </View>

      <Button
        icon="delete"
        color="crimson"
        onPress={() => {
          dispatch({
            type: actionTypes.SET_USER,
            user: todo,
          });
        }}
      >
        Delete
      </Button>
    </View>
  );
};
export default Todo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: "rgb(100,73,234)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textvalid: {
    fontSize: 30,
    padding: 30,
    color: "white",
  },
  textinvalid: {
    fontSize: 30,
    padding: 30,
    textDecorationLine: "line-through",
    color: "grey",
  },
  todo: {
    width: 240,
  },
});
