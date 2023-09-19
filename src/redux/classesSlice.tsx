import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LiteratureClass } from "../domain/model/classes/LiteratureClass";

export interface ClassesSlice {
  value: LiteratureClass[];
}

const initialState: ClassesSlice = {
  value: [],
};

export const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    replace: (state, action: PayloadAction<LiteratureClass[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return { ...state, value: [...action.payload] };
    },
  },
});

// Action creators are generated for each case reducer function
export const { replace } = classesSlice.actions;

export default classesSlice.reducer;
