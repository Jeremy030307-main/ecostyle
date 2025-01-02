import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

import config from './config.js';
import publicRouter from './routes/publicRoute.js';
import adminRouter from './routes/adminRoute.js';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WishlistProvider } from './context/WishlistContext';
import wishlistRoutes from './routes/wishlist.js';

ReactDOM.render(
    <WishlistProvider>
        <App />
    </WishlistProvider>,
    document.getElementById('root')
);

const app = express();

const wishlistRoutes = require('./routes/wishlist'); // Import Wishlist Routes
app.use('/wishlist', wishlistRoutes); // Add Wishlist Routes

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
app.use('/', publicRouter);
app.use('/admin', adminRouter);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);