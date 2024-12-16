import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { addcolor } from '../controllers/colorController.js';

const colorRouter = express.Router();

colorRouter.post("/", addcolor)

export default colorRouter;