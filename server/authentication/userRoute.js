import express from 'express';
import { authenticate } from './middleware.js';

import { signUp, signIn, userSignOut, getUser } from './userController.js';

const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/signIn', signIn);
userRouter.delete('/signOut', userSignOut);
userRouter.get('/:id',authenticate, getUser)

export default userRouter;
