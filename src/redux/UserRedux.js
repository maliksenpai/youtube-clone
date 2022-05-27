import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './UserActions';

const initialState = {
    email: null,
    emailVerified: null,
    uid: null,
    loading: false,
};

export const userSlicer = createSlice({
    name: 'UserSlicer',
    initialState: initialState,
    reducers: {
        updateUser: (state, action) => {
            const copyState = { ...state };
            copyState.email = action.payload.email;
            copyState.emailVerified = action.payload.emailVerified;
            copyState.uid = action.payload.uid;
            return copyState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            const copyState = { ...state };
            copyState.loading = true;
            return copyState;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const copyState = { ...state };
            if (action.payload.user) {
                copyState.email = action.payload.user.email;
                copyState.emailVerified = action.payload.user.emailVerified;
                copyState.uid = action.payload.user.uid;
            }
            copyState.loading = false;
            return copyState;
        });
    },
});

export const { updateUser } = userSlicer.actions;
