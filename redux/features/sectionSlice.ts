import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
        setSection: (state, action) => {
            state.value = action?.payload
        }
    }
})

export const { setSection } = sectionSlice.actions

export default sectionSlice.reducer