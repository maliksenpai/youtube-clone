import { firebaseApp } from '../Main';

export const addVideoHistory = async ({ videoId, userId, historyVideos }) => {
    const copyHistoryVideos = [...historyVideos];
    copyHistoryVideos.push(videoId);
    const database = firebaseApp.firestore();
    await database.collection('historyVideos').doc(userId).set({ historyVideos: copyHistoryVideos });
    return copyHistoryVideos;
};

export const getVideosFromHistory = async ({ historyVideos }) => {
    const database = firebaseApp.firestore();
    const response = await database.collection('videos').where('id', 'in', historyVideos).get();
    return response.docs;
};
