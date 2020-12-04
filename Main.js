import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Todo from "./Todo.js";
import { useStateValue } from "./StateProvider";
import { Appbar, TextInput } from "react-native-paper";

function Main() {
  const [input, setInput] = useState();
  const [todos, setTodos] = useState([]);
  const [{ user }] = useStateValue();
  useEffect(() => {
    const newinfo = todos.filter((todo) => todo !== user);
    setTodos(newinfo);
  }, [user]);
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Todo App" subtitle={"Sanchit Anand"} />
      </Appbar.Header>

      <ScrollView style={styles.body}>
        {todos.map((todo) => (
          <Todo key={todo} todo={todo} />
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
            setTodos([...todos, input]);
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
