import { firebaseApp } from '../Main';

export const uploadVideo = ({ video, name }) => {
    const storage = firebaseApp.storage();
    return storage.ref('/videos/' + name).put(video);
};

export const addVideoDatabase = async ({ title, description, duration, id, fileName }) => {
    const database = firebaseApp.firestore();
    const storage = firebaseApp.storage();
    const currentUser = firebaseApp.auth();
    const downloadUri = await storage.ref(`/videos/${fileName}`).getDownloadURL();
    const response = await database.collection('videos').add({
        id: id,
        title: title,
        uploader: currentUser.currentUser.email,
        uploaderId: currentUser.currentUser.uid,
        duration: duration,
        description: description,
        fileName: fileName,
        search: `${title} ${description}`,
        url: downloadUri,
        likedCount: 0,
    });
    return response;
};

export const getVideoFromProfile = async ({ email }) => {
    const database = firebaseApp.firestore();
    const response = await database.collection('videos').where('uploader', '==', email).get();
    return response.docs;
};

export const getVideoFromId = async ({ id }) => {
    const database = firebaseApp.firestore();
    const response = await database.collection('videos').doc(id).get();
    return response;
};

export const getVideos = async ({ lastVideo, search }) => {
    const database = firebaseApp.firestore();
    let query = database.collection('videos').limit(12);
    if (lastVideo) {
        query = query.startAfter(lastVideo);
    }
    if (search) {
        query = query.where('search', '>=', search).where('search', '<', search + 'z');
    }
    const response = await query.get();
    return response.docs;
};

export const getSuggestVideos = async ({ currentVideo }) => {
    const database = firebaseApp.firestore();
    let query = await database.collection('videos').limit(6).startAfter(currentVideo).get();
    query.docs.shift();
    return query.docs;
};
