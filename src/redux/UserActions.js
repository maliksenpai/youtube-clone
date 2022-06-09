import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserVideoDatas, loginUserFirebase } from '../data/FirebaseUser';

export const loginUser = createAsyncThunk('loginUser', async ({ email, password }) => {
    const response = await loginUserFirebase({ email: email, password: password });
    return {
        user: {
            email: response.user.email,
            emailVerified: response.user.emailVerified,
            uid: response.user.uid,
        },
    };
});

export const getDataForUser = createAsyncThunk('getDataForUser', async ({ id }) => {
    const response = await getUserVideoDatas({ id });
    return {
        data: response,
    };
});
