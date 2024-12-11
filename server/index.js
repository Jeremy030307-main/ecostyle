import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './config.js';
import productRoute from './routes/productRoute.js';
import userRouter from './authentication/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';

const app = express();

app.use(express.json());
app.use(cookieParser())

const corsOptions = {
  origin: "http://localhost:3000", // Your React app's URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

//routes
app.use('/product', productRoute);
app.use('/user', userRouter);
app.use('/category',categoryRouter);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);