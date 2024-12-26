import express from 'express';
import { authenticate } from './middleware.js';

import { newUser, getUser, setAdmin, listAllUsers } from '../controllers/userController.js';

const publicUserRouter = express.Router();
const adminUserRouter = express.Router();

publicUserRouter.get('/:id', getUser)

publicUserRouter.post('/', authenticate, newUser)

adminUserRouter.get('/', listAllUsers);
adminUserRouter.patch('/:id/set-admin', setAdmin);

export {publicUserRouter,adminUserRouter};
