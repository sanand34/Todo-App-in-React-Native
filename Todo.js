import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Dimensions,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { schedulePushNotification } from "./Notification.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");
import DatePicker from "react-native-datepicker";
const Todo = ({ todo }) => {
  const [{ todos }, dispatch] = useStateValue();
  const [date, setDate] = useState();
  // This is to manage Modal State
  const [isModalVisible, setModalVisible] = useState(false);

  // This is to manage TextInput State
  const [inputValue, setInputValue] = useState("");

  // Create toggleModalVisibility function that will
  // Open and close modal upon button clicks.
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };
  const presentDate = () => {
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
  };
  //viewing details about todo
  const viewData = () =>
    Alert.alert(
      todo.todo,
      todo.date,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

  //storing data in async storage
  async function _storeData(value) {
    try {
      await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  //if due date is current date set due date today
  useEffect(() => {
    const newinfo = todos.filter((thistodo) => thistodo.key !== todo.key);
    if (presentDate() == todo.due_date) {
      _storeData([
        ...newinfo,
        {
          key: todo.key,
          todo: todo.todo,
          check: todo.check,
          date: todo.date,
          due_date: "Today",
        },
      ]);
      dispatch({
        type: actionTypes.SET_TODOS,
        todos: [
          ...newinfo,
          {
            key: todo.key,
            todo: todo.todo,
            check: todo.check,
            date: todo.date,
            due_date: "Today",
          },
        ],
      });
    }
  }, [todo.due_date]);

  return (
    <View style={styles.container}>
      <Checkbox
        status={todo.check ? "checked" : "unchecked"}
        onPress={() => {
          const newinfo = todos.filter((thistodo) => thistodo.key !== todo.key);
          _storeData([
            ...newinfo,
            {
              key: todo.key,
              todo: todo.todo,
              check: !todo.check,
              date: todo.date,
              due_date: todo.due_date,
            },
          ]);
          dispatch({
            type: actionTypes.SET_TODOS,
            todos: [
              ...newinfo,
              {
                key: todo.key,
                todo: todo.todo,
                check: !todo.check,
                date: todo.date,
                due_date: todo.due_date,
              },
            ],
          });
        }}
        color="white"
      />
      <View style={styles.todo}>
        <TouchableOpacity
          onPress={async () => {
            viewData();
            await schedulePushNotification(todo.todo, todo.due_date);
          }}
        >
          <Text style={todo.check ? styles.textinvalid : styles.textvalid}>
            {todo.todo}
          </Text>
        </TouchableOpacity>
        <Text
          style={todo.due_date === "Today" ? styles.text1 : styles.text2}
        >{`Due:${todo.due_date}`}</Text>
      </View>

      <Button
        title="delete"
        color="rgb(100,73,234)"
        onPress={() => {
          dispatch({
            type: actionTypes.SET_USER,
            user: todo.key,
          });
        }}
      >
        Delete
      </Button>
      <Button
        color="rgb(100,73,234)"
        title="Edit"
        onPress={toggleModalVisibility}
      />

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Edit Todo..."
              value={inputValue}
              style={styles.textInput}
              onChangeText={(value) => setInputValue(value)}
              onSubmitEditing={() => {
                const newinfo = todos.filter(
                  (thistodo) => thistodo.key !== todo.key
                );
                _storeData([
                  ...newinfo,
                  {
                    key: todo.key,
                    todo: inputValue,
                    check: todo.check,
                    date: todo.date,
                    due_date: todo.due_date,
                  },
                ]);
                dispatch({
                  type: actionTypes.SET_TODOS,
                  todos: [
                    ...newinfo,
                    {
                      key: todo.key,
                      todo: inputValue,
                      check: todo.check,
                      date: todo.date,
                      due_date: todo.due_date,
                    },
                  ],
                });
                setInputValue("");
                toggleModalVisibility();
              }}
            />
            <DatePicker
              style={{ width: 200 }}
              date={date}
              mode="date"
              placeholder={date}
              format="YYYY/MM/DD"
              minDate={presentDate()}
              maxDate="2030/05/01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                const newinfo = todos.filter(
                  (thistodo) => thistodo.key !== todo.key
                );
                _storeData([
                  ...newinfo,
                  {
                    key: todo.key,
                    todo: todo.todo,
                    check: todo.check,
                    date: todo.date,
                    due_date: date,
                  },
                ]);
                dispatch({
                  type: actionTypes.SET_TODOS,
                  todos: [
                    ...newinfo,
                    {
                      key: todo.key,
                      todo: todo.todo,
                      check: todo.check,
                      date: todo.date,
                      due_date: date,
                    },
                  ],
                });
                setDate(date);

                toggleModalVisibility();
              }}
            />
            <View style={{ margin: 10 }}>
              <Button
                color="rgb(100,73,234)"
                title="Close"
                onPress={toggleModalVisibility}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Todo;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "90%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
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

    color: "white",
  },
  text1: {
    fontSize: 20,

    color: "red",
  },
  text2: {
    fontSize: 20,

    color: "lightgreen",
  },
  textinvalid: {
    fontSize: 30,

    textDecorationLine: "line-through",
    color: "grey",
  },
  todo: {
    width: 240,
  },
});
