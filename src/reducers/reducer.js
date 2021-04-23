export const initialState = {
  user: null,
  todos: [],
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_TODOS: "SET_TODOS",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actionTypes.SET_TODOS:
      return {
        ...state,
        todos: action.todos,
      };

    default:
      return state;
  }
};

export default reducer;
