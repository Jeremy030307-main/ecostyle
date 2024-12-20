import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { addcolor } from '../controllers/colorController.js';

const publicColorRouter = express.Router();
const adminColorRouter = express.Router();

adminColorRouter.post("/", addcolor)

export {publicColorRouter,adminColorRouter };