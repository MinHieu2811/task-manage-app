import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./features/boardSlice";

export const store = configureStore({
    reducer: {
        board: boardSlice
    }
})