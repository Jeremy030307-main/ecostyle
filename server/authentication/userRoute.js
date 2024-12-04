import express from 'express';

import { signUp, signIn, userSignOut, getUser } from './userController.js';

const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/signIn', signIn);
userRouter.delete('/signOut', userSignOut);
userRouter.get('/:id', getUser)

export default userRouter;
