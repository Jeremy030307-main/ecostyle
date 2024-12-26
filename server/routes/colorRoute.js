import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import { addcolor, deleteColor, getColors } from '../controllers/colorController.js';
import { newColorSchema } from '../schema/colorSchema.js';

const publicColorRouter = express.Router();
const adminColorRouter = express.Router();


publicColorRouter.get("/:id?", getColors);

adminColorRouter.post("/", validateRequest(newColorSchema), addcolor);
adminColorRouter.delete("/:id", deleteColor);

export {publicColorRouter,adminColorRouter };