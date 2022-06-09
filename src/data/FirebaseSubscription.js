import { app } from '../index';

export const subscribeUser = async ({ subscribeUserId, subscriptionCount, userId, subscriptions }) => {
    const database = app.firestore();
    const copySubscriptions = [...subscriptions];
    copySubscriptions.push(subscribeUserId);
    await database
        .collection('users')
        .doc(subscribeUserId)
        .update({ subscriptionCount: subscriptionCount + 1 });
    await database.collection('subscriptions').doc(userId).set({ subscriptions: copySubscriptions });
    return copySubscriptions;
};

export const unsubscribeUser = async ({ subscribeUserId, subscriptionCount, userId, subscriptions }) => {
    const database = app.firestore();
    const copySubscriptions = [...subscriptions].filter((element) => element !== subscribeUserId);
    await database
        .collection('users')
        .doc(subscribeUserId)
        .update({ subscriptionCount: subscriptionCount - 1 });
    await database.collection('subscriptions').doc(userId).set({ subscriptions: copySubscriptions });
    return copySubscriptions;
};

export const getSubscriptionVideos = async ({ subscriptions }) => {
    const database = app.firestore();
    const response = await database.collection('videos').where('uploaderId', 'in', subscriptions).get();
    return response.docs;
};
