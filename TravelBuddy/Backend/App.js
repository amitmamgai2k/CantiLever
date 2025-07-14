
// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectToDB from './src/db/db.js';
import userRoutes from './src/routes/user.route.js';

dotenv.config();
const app = express();
connectToDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  console.log('Request Received');
  res.send('Hello world');
});
app.use('/users', userRoutes);


export default app;
