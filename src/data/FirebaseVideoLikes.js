import { firebaseApp } from '../Main';

export const likeVideo = async ({ videoKey, videoId, likeCount, userId, likedVideos }) => {
    const database = firebaseApp.firestore();
    const copyLikedVideos = [...likedVideos];
    copyLikedVideos.push(videoId);
    console.log(videoKey);
    await database
        .collection('videos')
        .doc(videoKey)
        .update({ likeCount: likeCount + 1 });
    await database.collection('likedVideos').doc(userId).set({ likedVideos: copyLikedVideos });
    return copyLikedVideos;
};

export const dislikeVideo = async ({ videoKey, videoId, likeCount, userId, likedVideos }) => {
    const database = firebaseApp.firestore();
    const copyLikedVideos = [...likedVideos].filter((element) => element !== videoId);
    await database
        .collection('videos')
        .doc(videoKey)
        .update({ likeCount: likeCount - 1 });
    await database.collection('likedVideos').doc(userId).set({ likedVideos: copyLikedVideos });
    return copyLikedVideos;
};

export const getLikedVideos = async ({ likedVideos }) => {
    const database = firebaseApp.firestore();
    const response = await database.collection('videos').where('id', 'in', likedVideos).get();
    return response.docs;
};
