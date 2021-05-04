import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Modal, TextInput, Dimensions } from "react-native";

import { CheckBox, Divider, Tooltip, Text, Icon } from "react-native-elements";
import { useStateValue } from "../containers/StateProvider";

import { actionTypes } from "../reducers/reducer";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-datepicker";

import { calenderDate } from "./Dates";

const { width } = Dimensions.get("window");

const Todo = ({ todo }) => {
  const [{ todos }, dispatch] = useStateValue();
  const [date, setDate] = useState();

  const [isModalVisible, setModalVisible] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const didMountRef = useRef(false);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };

  async function _storeData(value) {
    try {
      await AsyncStorage.setItem("10~Tasks", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (didMountRef.current) {
      const newinfo = todos.filter((thistodo) => thistodo.key !== todo.key);
      if (calenderDate() == todo.due_date) {
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
    } else didMountRef.current = true;
  }, [todo.due_date]);

  return (
    <View>
      <View style={styles.container}>
        <CheckBox
          iconRight
          checkedColor="green"
          uncheckedColor="skyblue"
          iconType="material"
          uncheckedIcon="clear"
          checkedIcon="done"
          checked={todo.check}
          onPress={() => {
            const newinfo = todos.filter(
              (thistodo) => thistodo.key !== todo.key
            );
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
          <Tooltip
            backgroundColor={"lightblue"}
            popover={<Text style={{ color: "white" }}>{todo.date}</Text>}
          >
            <Text style={todo.check ? styles.textinvalid : styles.textvalid}>
              {todo.todo}
            </Text>
          </Tooltip>

          <Text
            style={todo.due_date === "Today" ? styles.text1 : styles.text2}
          >{`${todo.due_date}`}</Text>
        </View>

        <Icon
          name="trash"
          type="font-awesome"
          color="#f50"
          onPress={() => {
            dispatch({
              type: actionTypes.SET_USER,
              user: todo.key,
            });
          }}
        />

        <Icon
          name="pencil"
          type="font-awesome"
          color="skyblue"
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
                minDate={calenderDate()}
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
                <Icon
                  name="close"
                  type="font-awesome"
                  color="red"
                  onPress={toggleModalVisibility}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <Divider style={{ backgroundColor: "black" }} />
    </View>
  );
};
export default Todo;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderWidth: 1,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textvalid: {
    fontSize: 30,

    color: "black",
  },
  text1: {
    fontSize: 20,

    color: "red",
  },
  text2: {
    fontSize: 20,

    color: "green",
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
