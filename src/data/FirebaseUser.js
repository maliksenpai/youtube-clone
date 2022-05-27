import { app } from '../index';

export const loginUserFirebase = async ({ email, password }) => {
    try {
        const auth = app.auth();
        const loginResponse = await auth.signInWithEmailAndPassword(email, password);
        return loginResponse;
    } catch (e) {
        console.log(e);
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

const registerUser = async ({ email, password }) => {
    try {
        const auth = app.auth();
        const response = await auth.createUserWithEmailAndPassword(email, password);
        await response.user.sendEmailVerification();
        await createUserDatabase({ uid: response.user.uid, email: email });
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
