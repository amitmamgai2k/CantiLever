
import { configureStore } from '@reduxjs/toolkit'
import UserAuth from './slices/userAuthSlice.js';
import UserActivity from './slices/userActivitySlice.js';


const store = configureStore({
    reducer: {
        userAuth: UserAuth,
        userActivity: UserActivity


    },
    devTools: true
});

export default store;
