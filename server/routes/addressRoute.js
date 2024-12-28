import express from 'express';
import { addNewAddress, deleteAddress, getUserAddress, updateAddress } from '../controllers/addressController.js';
import { addressSchema } from '../schema/addressSchema.js';
import { validateRequest } from './middleware.js';

const addressRouter = express.Router();

addressRouter.get("/", getUserAddress);

addressRouter.post("/", validateRequest(addressSchema), addNewAddress);
addressRouter.put("/:addressName",validateRequest(addressSchema), updateAddress);
addressRouter.delete("/:addressName", deleteAddress);

export default addressRouter;