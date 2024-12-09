import express from 'express';
import cors from 'cors';

import config from './config.js';
import productRoute from './routes/productRoute.js';
import userRouter from './authentication/userRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/product', productRoute);
app.use('/user', userRouter);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);