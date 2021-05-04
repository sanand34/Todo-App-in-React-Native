import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Input, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import { v4 } from "uuid";
import { useStateValue } from "./containers/StateProvider";
import { actionTypes } from "./reducers/reducer";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { templateDate } from "./components/Dates";
import Notification from "./components/Notifications";
import Todo from "./components/Todo.js";
function Main() {
  const [input, setInput] = useState();

  const [{ user, todos }, dispatch] = useStateValue();
  const didMountRef = useRef(false);

  Array.prototype.sortBy = function (p) {
    return this.slice(0).sort(function (a, b) {
      return a[p] < b[p] ? 1 : a[p] > b[p] ? -1 : 0;
    });
  };
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
      } else {
        const date = templateDate();
        const key = v4();
        dispatch({
          type: actionTypes.SET_TODOS,
          todos: [
            {
              key: key,
              todo: "Welcome",
              check: false,
              date: date,
              due_date: "Today",
            },
          ],
        });
        _storeData([
          {
            key: key,
            todo: "Welcome",
            check: false,
            date: date,
            due_date: "Today",
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
    return;
  }

  useEffect(() => {
    _retrieveData();
  }, []);

  useEffect(() => {
    if (didMountRef.current) {
      const newinfo = todos.filter((todo) => todo.key !== user);
      todos && _storeData(newinfo);
      todos &&
        dispatch({
          type: actionTypes.SET_TODOS,
          todos: newinfo,
        });
    } else didMountRef.current = true;
  }, [user]);

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{ text: "TODOS", style: { color: "#fff" } }}
        rightComponent={{ icon: "home", color: "#fff" }}
      />

      <ScrollView style={styles.body}>
        {todos.sortBy("due_date").map((todo) => (
          <Todo key={todo.key} todo={todo} />
        ))}
      </ScrollView>

      <View>
        <Input
          placeholder="Add Todos...."
          leftIcon={<Icon name="list" size={24} color="black" />}
          value={input}
          onChangeText={(text) => {
            setInput(text);
          }}
          onSubmitEditing={() => {
            const key = v4();
            const date = templateDate();
            dispatch({
              type: actionTypes.SET_TODOS,
              todos: [
                ...todos,
                {
                  key: key,
                  todo: input,
                  check: false,
                  date: date,
                  due_date: "Today",
                },
              ],
            });

            _storeData([
              ...todos,
              {
                key: key,
                todo: input,
                check: false,
                date: date,
                due_date: "Today",
              },
            ]);
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
    paddingTop: 10,
    height: 10,
  },
  header: {
    padding: 40,
  },
});
