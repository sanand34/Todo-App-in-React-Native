import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Todo from "./Todo.js";
import { v4 } from "uuid";
import { useStateValue } from "./StateProvider";
import { Appbar, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionTypes } from "./reducer";
function Main() {
  const [input, setInput] = useState();
  const [{ user, todos }, dispatch] = useStateValue();
  async function _storeData(value) {
    try {
      await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }
  async function _retrieveData() {
    try {
      const value = await AsyncStorage.getItem("10~Tasks");
      if (JSON.parse(value) !== null) {
        dispatch({
          type: actionTypes.SET_TODOS,
          todos: JSON.parse(value),
        });

        console.log(value);
      } else {
        dispatch({
          type: actionTypes.SET_TODOS,
          todos: [{ key: v4(), todo: "Welcome", check: false }],
        });
        _storeData([{ key: v4(), todo: "Welcome", check: false }]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    _retrieveData();
  }, []);
  useEffect(() => {
    const newinfo = todos.filter((todo) => todo.key !== user);
    _storeData(newinfo);
    dispatch({
      type: actionTypes.SET_TODOS,
      todos: newinfo,
    });
  }, [user]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Todo App" subtitle={"Sanchit Anand"} />
      </Appbar.Header>

      <ScrollView style={styles.body}>
        {todos?.map((todo) => (
          <Todo key={todo.key} todo={todo} />
        ))}
      </ScrollView>
      <View>
        <TextInput
          label="Add Todo"
          value={input}
          onChangeText={(text) => {
            setInput(text);
          }}
          onSubmitEditing={() => {
            dispatch({
              type: actionTypes.SET_TODOS,
              todos: [...todos, { key: v4(), todo: input, check: false }],
            });

            _storeData([...todos, { todo: input, check: false }]);
            setInput("");
          }}
        />
      </View>
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    backgroundColor: "rgb(34,34,34)",
    paddingTop: 10,
    height: 10,
  },
  header: {
    padding: 40,
  },
});
