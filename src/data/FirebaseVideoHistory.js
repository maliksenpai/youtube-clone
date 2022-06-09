import { app } from '../index';

export const addVideoHistory = async ({ videoId, userId, historyVideos }) => {
    const copyHistoryVideos = [...historyVideos];
    copyHistoryVideos.push(videoId);
    const database = app.firestore();
    await database.collection('historyVideos').doc(userId).set({ historyVideos: copyHistoryVideos });
    return copyHistoryVideos;
};

export const getVideosFromHistory = async ({ historyVideos }) => {
    const database = app.firestore();
    const response = await database.collection('videos').where('id', 'in', historyVideos).get();
    return response.docs;
};
