
import { db } from "../firebase.js";

const productCollection = 'product'

// get all products
export const getProducts = async (req, res, next) => {
  try {
    const productsSnapshot = await db.collection(productCollection).get();

    if (productsSnapshot.empty) {
      res.status(400).send('No Products found');
    } else {
      const productArray = productsSnapshot.docs.map((doc) => {
        const {category, collection, ...productData} = doc.data();
  
        return {
          id: doc.id,
          ...productData,
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
    const data = await db.collection(productCollection).doc(id).get();

    if (data.exists) {
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
    await db.collection(productCollection).add(data);
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
    await db.collection(productCollection).doc(id).set(data)
    res.status(200).send('product updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//delete product (with id)
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await db.collection(productCollection).doc(id).delete();
    res.status(200).send('Product deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
