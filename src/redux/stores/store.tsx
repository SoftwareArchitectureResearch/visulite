import { configureStore } from "@reduxjs/toolkit";
import classesReducer from "../classesSlice";

export const store = configureStore({
  reducer: {
    classes: classesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
