import express from 'express';

import { signUp, signIn, userSignOut } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/signIn', signIn);
userRouter.post('/signOut', userSignOut);

export default userRouter;
