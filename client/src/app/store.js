import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createTransform,
  persistReducer,
} from "redux-persist";
import { stringify, parse } from "flatted";
import storage from "redux-persist/lib/storage";

export const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState)
);
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [transformCircular],
};
const reducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
