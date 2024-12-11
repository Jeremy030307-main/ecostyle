import express from 'express';
import { authenticate, isAdmin } from './middleware.js';

import { newUser, updateUser, deleteUser, getUser, setAdmin } from './userController.js';

const userRouter = express.Router();

userRouter.get('/:id', getUser)

userRouter.post('/:id',authenticate, newUser)

userRouter.put('/:id/admin',isAdmin, setAdmin)

userRouter.put('/:id',authenticate, updateUser)

userRouter.delete('/delete/:id',authenticate, deleteUser)

export default userRouter;
