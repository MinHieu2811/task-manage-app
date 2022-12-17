import { BoardData } from '@/models/index'
import { createSlice } from '@reduxjs/toolkit'
interface Props {
    value: BoardData[]
}
const initialState: Props = {value: []}

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setBoards: (state, action) => {
            state.value = action.payload
        },
        addBoards: (state, action) => {
            state.value = [...state.value, action.payload];
        },
        updateBoard: (state, action) => {
            const updateItem = action.payload
            const arrFiltered = state.value.filter((item) => item?.boardId === updateItem?.boardId)
            state.value = [...arrFiltered, updateItem]
        },
        removeBoard: (state, action) => {
            const arrFiltered = state.value.filter((item) => item?.boardId === action.payload)
            state.value = [...arrFiltered]
        }
    }
})

export const { setBoards, addBoards, updateBoard, removeBoard } = boardSlice.actions

export default boardSlice.reducer