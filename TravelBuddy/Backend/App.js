
// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import connectToDB from './src/db/db.js';
import userRoutes from './src/routes/user.route.js';
import ActivityRoutes from './src/routes/activity.route.js';
import MessageRoutes from './src/routes/message.route.js';
import ChatRoutes from './src/routes/chatgroup.route.js'


dotenv.config();
const app = express();
connectToDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
  console.log('Request Received');
  res.send('Hello world');
});
app.use('/users', userRoutes);
app.use('/activity', ActivityRoutes);
app.use('/messages', MessageRoutes);
app.use('/chat', ChatRoutes);

export default app;
