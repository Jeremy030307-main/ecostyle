import express from 'express';
import { authenticate, isAdmin } from './middleware.js';

import { newUser, updateUser, deleteUser, getUser, setAdmin } from './userController.js';

const userRouter = express.Router();

userRouter.get('/:id', getUser)

userRouter.post('/new',authenticate, newUser)

userRouter.put('/admin/:id',isAdmin, setAdmin)
userRouter.put('/update',authenticate, updateUser)

userRouter.delete('/delete/:id',authenticate, deleteUser)

export default userRouter;
