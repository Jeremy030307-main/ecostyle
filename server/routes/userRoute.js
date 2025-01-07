import express from 'express';
import { authenticate } from './middleware.js';

import { newUser, getUser, setAdmin, listAllUsers, setCookie, updateUser } from '../controllers/userController.js';

const publicUserRouter = express.Router();
const adminUserRouter = express.Router();

publicUserRouter.get('/',authenticate, getUser)
publicUserRouter.post("/set-cookie", setCookie)

publicUserRouter.post('/', authenticate, newUser)
publicUserRouter.put("/", authenticate, updateUser)

adminUserRouter.get('/', listAllUsers);
adminUserRouter.patch('/:id/set-admin', setAdmin);

export {publicUserRouter,adminUserRouter};
