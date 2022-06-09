import { createSlice } from '@reduxjs/toolkit';
import { getDataForUser, loginUser } from './UserActions';

const initialState = {
    email: null,
    emailVerified: null,
    uid: null,
    loading: false,
    likedVideos: [],
    historyVideos: [],
    subscriptions: [],
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
        updateDataUser: (state, action) => {
            const copyState = { ...state };
            copyState.likedVideos = action.payload.likedVideos;
            copyState.historyVideos = action.payload.historyVideos;
            copyState.subscriptions = action.payload.subscriptions;
            return copyState;
        },
        clearUser: () => {
            return initialState;
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
        builder.addCase(getDataForUser.pending, (state) => {
            const copyState = { ...state };
            copyState.loading = true;
            return copyState;
        });
        builder.addCase(getDataForUser.fulfilled, (state, action) => {
            const copyState = { ...state };
            if (action.payload.data) {
                copyState.likedVideos = action.payload.data.likedVideos.likedVideos
                    ? action.payload.data.likedVideos.likedVideos
                    : [];
                copyState.historyVideos = action.payload.data.historyVideos.historyVideos
                    ? action.payload.data.historyVideos.historyVideos
                    : [];
                copyState.subscriptions = action.payload.data.subscriptions.subscriptions
                    ? action.payload.data.subscriptions.subscriptions
                    : [];
            }
            copyState.loading = false;
            return copyState;
        });
    },
});

export const { updateUser, updateDataUser, clearUser } = userSlicer.actions;
