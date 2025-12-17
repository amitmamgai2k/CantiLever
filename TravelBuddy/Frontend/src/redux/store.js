
import { configureStore } from '@reduxjs/toolkit'
import UserAuth from './slices/userAuthSlice.js';
import UserActivity from './slices/userActivitySlice.js';
import Chat from './slices/ChatSlice.js';
import friendReducer from './slices/friendSlice.js';
import notificationReducer from './slices/notificationSlice.js';
import privateChatReducer from './slices/privateChatSlice.js';


const store = configureStore({
    reducer: {
        userAuth: UserAuth,
        userActivity: UserActivity,
        chat: Chat,
        friend: friendReducer,
        notification: notificationReducer,
        privateChat: privateChatReducer


    },
    devTools: true
});

export default store;
