import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Todo from "./Todo.js";
import { v4 } from "uuid";
import { useStateValue } from "./StateProvider";
import { Appbar, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { actionTypes } from "./reducer";
import Notify from "./Notification.js";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
BackgroundFetch.setMinimumIntervalAsync(15);
const taskName = "test-background-fetch";
TaskManager.defineTask(taskName, async () => {
  try {
    await AsyncStorage.setItem("TASKS", "I like to save it.");
  } catch (error) {
    alert("tanımlama hatası");
    // Error saving data
  }

  return BackgroundFetch.Result.NewData;
});
function Main() {
  const [input, setInput] = useState();

  const [{ user, todos }, dispatch] = useStateValue();
  const didMountRef = useRef(false);

  //Get Indian Standard time
  const getDate = () => {
    let d = new Date();
    let ank = d.toLocaleString();
    let currentDate = /[0-9]*:[0-9]*:[0-9]*/g.exec(JSON.stringify(ank));
    let day = /[A-za-z]+ [A-za-z]+ [0-9]+/g.exec(JSON.stringify(ank));
    let year = /[0-9][0-9][0-9][0-9]/g.exec(JSON.stringify(ank));
    return `${day}  ${year}\n${currentDate}`;
  };

  //Sorting todos
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

  //Receiving data from async storage
  async function _retrieveData() {
    try {
      const value = await AsyncStorage.getItem("10~Tasks");
      if (JSON.parse(value) !== null) {
        dispatch({
          type: actionTypes.SET_TODOS,
          todos: JSON.parse(value),
        });
      } else {
        const date = getDate();
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
  const taskManager = async () => {
    await BackgroundFetch.registerTaskAsync(taskName);
    console.log("task registered");

    const status = await BackgroundFetch.getStatusAsync();

    switch (status) {
      case BackgroundFetch.Status.Restricted:
        alert("Restrict");
        break;
      case BackgroundFetch.Status.Denied:
        alert("Background execution is disabled");
        break;

      case BackgroundFetch.Status.Available:
        alert("Avaible");

        break;

      default: {
        alert("Background execution allowed");

        let tasks = await TaskManager.getRegisteredTasksAsync();
        if (tasks.find((f) => f.taskName === taskName) == null) {
          alert("Registering task");
          await BackgroundFetch.registerTaskAsync(taskName);

          tasks = await TaskManager.getRegisteredTasksAsync();
          alert("Tanımlananlar", tasks);
        } else {
          alert(`Task ${taskName} already registered, skipping`);
        }

        await BackgroundFetch.setMinimumIntervalAsync(15);

        break;
      }
    }
  };
  //fetching data once when the component loads
  useEffect(() => {
    _retrieveData();

    taskManager();
  }, []);

  //Deletion of todo
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
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Todo App" subtitle={"Sanchit Anand"} />
      </Appbar.Header>

      <ScrollView style={styles.body}>
        {todos.sortBy("due_date").map((todo) => (
          <Todo key={todo.key} todo={todo} />
        ))}
      </ScrollView>
      <Notify />
      <View>
        <TextInput
          label="Add Todo"
          value={input}
          onChangeText={(text) => {
            setInput(text);
          }}
          onSubmitEditing={() => {
            const key = v4();
            const date = getDate();
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
    backgroundColor: "rgb(34,34,34)",
    paddingTop: 10,
    height: 10,
  },
  header: {
    padding: 40,
  },
});
/*

let newtodos = [];
    todos.map((todo) => {
      if (todo.due_date === "2021/03/17") {
        newtodos = [
          ...newtodos,
          {
            key: todo.key,
            todo: todo.todo,
            check: todo.check,
            date: todo.date,
            due_date: "Today",
          },
        ];
      } else {
        newtodos = [
          ...newtodos,
          {
            key: todo.key,
            todo: todo.todo,
            check: todo.check,
            date: todo.date,
            due_date: todo.due_date,
          },
        ];
      }
      console.log("helooooooo", newtodos);
    });
    _storeData(newtodos);
    dispatch({
      type: actionTypes.SET_TODOS,
      todos: newtodos,
    });

    
*/
