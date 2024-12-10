import firebase from '../firebase.js';
import Product from '../models/productModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const db = getFirestore(firebase);
const productCollection = 'product'

// get all products
export const getProducts = async (req, res, next) => {
  try {
    const productsSnapshot = await getDocs(collection(db, productCollection));
    // const productArray = [];

    if (productsSnapshot.empty) {
      res.status(400).send('No Products found');
    } else {
      const productArray = productsSnapshot.docs.map((doc) => {
        const productData = doc.data();
  
        // Extract only the reference IDs from the "category" field
        const categoryIds = productData.category.map((categoryRef) => categoryRef.id);
  
        return {
          id: doc.id,
          ...productData,
          category: categoryIds, // Replace full references with just IDs
        };
      });
  
      res.status(200).send(productArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//get product by id
export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await getDoc(doc(db, productCollection, id));

    if (data.exists()) {
      const productData = data.data();

      // Extract only reference IDs from the category field
      const categoryIds = productData.category.map((categoryRef) => categoryRef.id);

      // Replace the category field with the list of IDs
      const cleanedData = {
        ...productData,
        category: categoryIds,
      };

      res.status(200).send(cleanedData);
    } else {
      res.status(404).send('product not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// ---------- Admin action ------------------
//create new product
export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, productCollection), data);
    res.status(200).send('product created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//update product (with id)
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = doc(db, productCollection, id);
    await updateDoc(product, data);
    res.status(200).send('product updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//delete product (with id)
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db,productCollection, id));
    res.status(200).send('Product deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
