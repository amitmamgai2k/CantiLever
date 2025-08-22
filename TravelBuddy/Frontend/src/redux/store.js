
import { configureStore } from '@reduxjs/toolkit'
import UserAuth from './slices/userAuthSlice.js';
import UserActivity from './slices/userActivitySlice.js';
import Chat from './slices/ChatSlice.js';


const store = configureStore({
    reducer: {
        userAuth: UserAuth,
        userActivity: UserActivity,
        chat: Chat


    },
    devTools: true
});

export default store;
