import express from 'express';
import { authenticate, isAdmin, validateRequest } from './middleware.js';
import {getCollection, getCollections, addCollection, deleteCollection, updateCollection, updateCollectionStatus, getCollectionDetail } from '../controllers/collectionController.js';
import { newCollectionSchema, updateCollectionSchema } from '../schema/collectionSchema.js';

const collectionRouter = express.Router();

collectionRouter.get('/', getCollections);
collectionRouter.get('/:id', getCollection);

// -------- Admin Route --------------
collectionRouter.get('/:id/admin', getCollectionDetail)

collectionRouter.post('/',validateRequest(newCollectionSchema), addCollection)

collectionRouter.put('/:id',validateRequest(updateCollectionSchema), updateCollection)
collectionRouter.put('/:id/:status', updateCollectionStatus)

collectionRouter.delete('/:id/', deleteCollection)

export default collectionRouter;