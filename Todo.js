import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Checkbox, Button } from "react-native-paper";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { _storeData } from "./Main";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Todo = ({ todo }) => {
  const [{ todos, user }, dispatch] = useStateValue();
  const [checked, setChecked] = useState(todo.check);

  return (
    <View style={styles.container}>
      <Checkbox
        status={checked ? true : false}
        onPress={() => {
          async function _storeData(value) {
            try {
              await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
            } catch (error) {
              console.log(error);
            }
          }
          const newinfo = todos.filter((thistodo) => thistodo.key !== todo.key);
          setChecked(!todo.check);
          _storeData([
            { key: todo.key, todo: todo.todo, check: !todo.check },
            ...newinfo,
          ]);
          dispatch({
            type: actionTypes.SET_TODOS,
            todos: [
              { key: todo.key, todo: todo.todo, check: !todo.check },
              ...newinfo,
            ],
          });
        }}
        color="white"
      />
      <View style={styles.todo}>
        <Text style={checked ? styles.textinvalid : styles.textvalid}>
          {todo.todo}
        </Text>
      </View>

      <Button
        icon="delete"
        color="crimson"
        onPress={() => {
          dispatch({
            type: actionTypes.SET_USER,
            user: todo.key,
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
