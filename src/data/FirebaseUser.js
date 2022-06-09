import { app } from '../index';

export const loginUserFirebase = async ({ email, password }) => {
    try {
        const auth = app.auth();
        const loginResponse = await auth.signInWithEmailAndPassword(email, password);
        return loginResponse;
    } catch (e) {
        if (e.code === 'auth/user-not-found') {
            const response = await registerUser({ email, password });
            return response;
        }
        return null;
    }
};

export const getProfileData = async ({ id }) => {
    const database = app.firestore();
    const response = await database.collection('users').where('uid', '==', id).get();
    return response.docs[0].data();
};

export const getUserVideoDatas = async ({ id }) => {
    const datas = {};
    const database = app.firestore();
    const likedVideosResponse = await database.collection('likedVideos').doc(id).get();
    datas.likedVideos = likedVideosResponse.data() === undefined ? [] : likedVideosResponse.data();
    const historyVideosResponse = await database.collection('historyVideos').doc(id).get();
    datas.historyVideos = historyVideosResponse.data() === undefined ? [] : historyVideosResponse.data();
    const subscriptionsResponse = await database.collection('subscriptions').doc(id).get();
    datas.subscriptions = subscriptionsResponse.data() === undefined ? [] : subscriptionsResponse.data();
    return datas;
};

export const getSubscriptionCount = async ({ id }) => {
    const database = app.firestore();
    const response = await database.collection('users').where('uid', '==', id).get();
    return response.docs[0].data().subscriptionCount;
};

const registerUser = async ({ email, password }) => {
    try {
        const auth = app.auth();
        const response = await auth.createUserWithEmailAndPassword(email, password);
        await response.user.sendEmailVerification();
        await createUserDatabase({ uid: response.user.uid, email: email, subscriptionCount: 0 });
        return response;
    } catch (e) {
        return null;
    }
};

const createUserDatabase = async ({ uid, email }) => {
    const database = app.firestore();
    await database.collection('users').doc(uid).set({ uid: uid, email: email });
};

export const logoutUser = async () => {
    const auth = app.auth();
    await auth.signOut();
};
