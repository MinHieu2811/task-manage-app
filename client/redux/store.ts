import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./features/boardSlice";
import sectionSlice from "./features/sectionSlice";

export const store = configureStore({
    reducer: {
        board: boardSlice,
        section: sectionSlice,
    }
})