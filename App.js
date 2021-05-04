import React, { useState, useEffect } from "react";
import { View } from "react-native";

import reducer, { initialState } from "./src/reducers/reducer";
import { StateProvider } from "./src/containers/StateProvider";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Main from "./src/Main";

import { calenderDate } from "./src/components/Dates";

const App = () => {
  const [check, setCheck] = useState(false);
  async function _storeData(value) {
    try {
      await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  async function setToday() {
    let newTodos = [];
    const value = await AsyncStorage.getItem("10~Tasks");
    const todos = JSON.parse(value);
    if (todos !== null) {
      todos?.map((todo) => {
        if (todo.due_date === calenderDate()) {
          newTodos = [
            ...newTodos,
            {
              key: todo.key,
              todo: todo.todo,
              check: todo.check,
              date: todo.date,
              due_date: "Today",
            },
          ];
        } else {
          newTodos = [
            ...newTodos,
            {
              key: todo.key,
              todo: todo.todo,
              check: todo.check,
              date: todo.date,
              due_date: todo.due_date,
            },
          ];
        }
      });
    }
    _storeData(newTodos);
    setCheck(true);
  }
  useEffect(() => {
    setToday();
  }, []);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {check ? <Main /> : <View></View>}
    </StateProvider>
  );
};
export default App;
