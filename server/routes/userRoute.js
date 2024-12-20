import express from 'express';
import { authenticate, isAdmin } from './middleware.js';

import { newUser, updateUser, deleteUser, getUser, setAdmin } from '../controllers/userController.js';

const publicUserRouter = express.Router();
const adminUserRouter = express.Router();

publicUserRouter.get('/:id', getUser)

publicUserRouter.post('/:id',authenticate, newUser)

adminUserRouter.patch('/:id/set-admin', setAdmin)

publicUserRouter.patch('/:id',authenticate, updateUser)

publicUserRouter.delete('/:id',authenticate, deleteUser)

export {publicUserRouter,adminUserRouter};
