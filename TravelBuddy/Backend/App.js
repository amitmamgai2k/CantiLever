
// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import connectToDB from './src/db/db.js';
import userRoutes from './src/routes/user.route.js';
import ActivityRoutes from './src/routes/activity.route.js';
import MessageRoutes from './src/routes/message.route.js';


dotenv.config();
const app = express();
connectToDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  console.log('Request Received');
  res.send('Hello world');
});
app.use('/users', userRoutes);
app.use('/activities', ActivityRoutes);
app.use('/messages', MessageRoutes);


export default app;
