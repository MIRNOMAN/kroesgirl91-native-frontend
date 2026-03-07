import { combineReducers, configureStore } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseApi } from "../api/baseApi";
import authReducer from "../authSlice";

const toSecureStoreKey = (key: string) => {
  const sanitized = key.replace(/[^A-Za-z0-9._-]/g, "_");
  return sanitized.length > 0 ? sanitized : "persist_auth";
};

const storage =
  Platform.OS === "web"
    ? createWebStorage("local")
    : {
        getItem: (key: string) =>
          SecureStore.getItemAsync(toSecureStoreKey(key)),
        setItem: (key: string, value: string) =>
          SecureStore.setItemAsync(toSecureStoreKey(key), value, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          }),
        removeItem: (key: string) =>
          SecureStore.deleteItemAsync(toSecureStoreKey(key)),
      };

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "role", "isAuthenticated"],
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Export states and hooks
export const getCurrentState = () => store.getState();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
