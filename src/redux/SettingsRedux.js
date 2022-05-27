import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: localStorage.getItem('theme') ? 'dark' : 'light',
};

export const settingsSlice = createSlice({
    name: 'settingsSlice',
    initialState: initialState,
    reducers: {
        updateSettings: (state, action) => {
            const copyState = { ...state };
            copyState.theme = action.payload.theme;
        },
    },
});

export const { updateSettings } = settingsSlice.actions;
