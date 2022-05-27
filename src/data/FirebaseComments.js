import { app } from '../index';
import { createId } from '../utils/idGenerator';

export const getCommentsFromVideo = async ({ id }) => {
    const database = app.firestore();
    const response = await database.collection('comments').where('videoId', '==', id).get();
    return response.docs;
};

export const addNewComment = async ({ message, videoId }) => {
    const database = app.firestore();
    const auth = app.auth();
    const comment = {
        id: createId(),
        message: message,
        videoId: videoId,
        date: new Date().getTime(),
        sender: auth.currentUser.email,
    };
    const response = await database.collection('comments').add(comment);
    return response;
};
