import express from 'express';
import { validateRequest } from './middleware.js';
import {getCollection, addCollection, deleteCollection, updateCollection, updateCollectionStatus, getCollectionDetail } from '../controllers/collectionController.js';
import { newCollectionSchema, updateCollectionSchema } from '../schema/collectionSchema.js';

const publicCollectionRouter = express.Router();
publicCollectionRouter.get('/:id?', getCollection);

// -------- Admin Route --------------
const adminCollectionRouter = express.Router();
adminCollectionRouter.get('/:id?', getCollectionDetail)

adminCollectionRouter.post('/',validateRequest(newCollectionSchema), addCollection)

adminCollectionRouter.patch('/:id',validateRequest(updateCollectionSchema), updateCollection)
adminCollectionRouter.patch('/:id/:status', updateCollectionStatus)

adminCollectionRouter.delete('/:id', deleteCollection)

export {publicCollectionRouter, adminCollectionRouter};