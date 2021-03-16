import React, { useState, useEffect } from "react";
import Main from "./Main";
import { View } from "react-native";
import reducer, { initialState } from "./reducer.js";
import { StateProvider } from "./StateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [check, setCheck] = useState(false);
  async function _storeData(value) {
    try {
      await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }
  function presentDate() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1;

    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return yyyy + "/" + mm + "/" + dd;
  }

  async function setToday() {
    let newTodos = [];
    const value = await AsyncStorage.getItem("10~Tasks");
    const todos = JSON.parse(value);
    if (todos !== null) {
      todos?.map((todo) => {
        if (todo.due_date === presentDate()) {
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
