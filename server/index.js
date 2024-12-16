import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from './config.js';
import productRoute from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import collectionRouter from './routes/collectionRoute.js';
import colorRouter from './routes/colorRoute.js';

const app = express();

app.use(express.json());
app.use(cookieParser())

const corsOptions = {
  origin: "http://localhost:3000", // Your React app's URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'My API',
          version: '1.0.0',
          description: 'API documentation using Swagger',
      },
      servers: [
          {
              url: config.port,
          },
      ],
 components: {
   securitySchemes: {
       bearerAuth: {
           type: 'http',
           scheme: 'bearer',
           bearerFormat: 'JWT', 
       },
   },
},
  },
  apis: ['./swagger/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//routes
app.use('/product', productRoute);
app.use('/user', userRouter);
app.use('/category',categoryRouter);
app.use('/collection',collectionRouter);
app.use("/color", colorRouter)

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);