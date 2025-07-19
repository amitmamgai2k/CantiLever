
import { configureStore } from '@reduxjs/toolkit'
import UserAuth from './slices/userAuthSlice.js';


const store = configureStore({
    reducer: {
        userAuth: UserAuth

    },
    devTools: true
});

export default store;
