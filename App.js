import React from "react";
import Main from "./Main";
import reducer, { initialState } from "./reducer.js";
import { StateProvider } from "./StateProvider";
const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Main />
    </StateProvider>
  );
};
export default App;
