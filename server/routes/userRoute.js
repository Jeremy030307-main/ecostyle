import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';

import { newUser, updateUser, deleteUser, getUser, setAdmin, getAllUser, listAllUsers } from '../controllers/userController.js';
import { newUserSchema, updateUserSchema } from '../schema/userSchema.js';

const publicUserRouter = express.Router();
const adminUserRouter = express.Router();

publicUserRouter.get('/:id', getUser)

publicUserRouter.post('/', authenticate, newUser)

adminUserRouter.get('/', listAllUsers);
adminUserRouter.patch('/:id/set-admin', setAdmin);

export {publicUserRouter,adminUserRouter};
