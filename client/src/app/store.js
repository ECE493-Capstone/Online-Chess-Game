import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import boardReducer from "../features/boardSlice";

const reducer = combineReducers({
  user: userReducer,
  board: boardReducer,
});
export default configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
