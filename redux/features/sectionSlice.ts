import { SectionData } from "@/models/board";
import { createSlice } from "@reduxjs/toolkit";

interface Props {
    value: SectionData[]
}
const initialState: Props = { value: [] };

export const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    setSection: (state, action) => {
      state.value = action?.payload;
    },
    addSection: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    updateSection: (state, action) => {
        const updateItem = action.payload
        const arrFiltered = state.value.filter((item) => item?.sectionId === updateItem?.sectionId)
        state.value = [...arrFiltered, updateItem]
    },
    removeSection: (state, action) => {
        const arrFiltered = state.value.filter((item) => item?.sectionId === action.payload)
        state.value = [...arrFiltered]
    }
  },
});

export const { setSection, addSection, updateSection, removeSection } = sectionSlice.actions;

export default sectionSlice.reducer;
