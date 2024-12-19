
import { db } from "../firebase.js";
import admin from 'firebase-admin'
import { COLLECTIONS, message } from "./utility.js";

const getVariantDetails = async (variantData) => {
  try{

    if (!variantData){
      throw new Error("No Color IDs")
    }

    const variantDocs = await Promise.all(
      variantData.map(async (variantDoc) => {
        const colorDoc = await db.collection('color').doc(variantDoc.color).get();

        if (colorDoc.exists){
          const {color, ...data} = variantDoc
          return {
            id: color,
            ...colorDoc.data(),
            ...data
          }
        }

        return null
      })
    )

    // Filter out null values (in case some color docs don't exist)
    const colors = variantDocs.filter((color) => color !== null);
    return colors

  } catch (error) {
    throw new Error(error.message)
  }
}

const checkStock = async (stockData) => {

  let totalStock = 0;
  stockData.forEach((doc) => {
      totalStock += doc.stock || 0;
    });

  return totalStock;
}

const getProductData = async (productID, t = null) => {
  const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);
  const productSnapshot = t ? await t.get(productRef) : await productRef.get();

  if (!productSnapshot.exists) {
    throw new Error("No Product Found."); 
  }
  return productSnapshot.data();
};

// get all products
export const getProducts = async (req, res, next) => {
  try {
    // Extract query parameters for filtering and sorting
    const { search, size, category, collection, color, order, sortBy, orderBy } = req.query;
    
    const productsSnapshot = await db.collection(COLLECTIONS.PRODUCT).get();

    if (productsSnapshot.empty) {
      return res.status(404).send(message('No Products found'));
    }
    const products = await Promise.all(
      productsSnapshot.docs
      .filter((doc) => doc.id !== "productID")
      .map(async (doc) => {
        const productData = doc.data();

        // Fetch colors: list of document IDs
        const variant = await getVariantDetails(productData.variant);

        return {
          id: doc.id,
          name: productData.name,
          price: productData.price,
          variant: variant, 
          size: productData.size,
          rating: productData.rating || null,
          reviewCount: productData.reviewCount || null
        };
      })
    );
      
      res.status(200).send(products);
  } catch (error) {
    res.status(500).send(message(error.message));
  }
};

//get product by id
export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await db.collection(COLLECTIONS.PRODUCT).doc(id).get();

    if (!data.exists) {
      return res.status(404).send(message('Product not found'));
    }
    const productData = data.data();
    const variant = await getVariantDetails(productData.variant)

    // Replace the category field with the list of IDs
    const cleanedData = {
      id: data .id,
      name: productData.name,
      details: productData.details,
      price: productData.price,
      variant: variant,
      size: productData.size,
      rating: productData.rating || null,
      reviewCount: productData.reviewCount || null
    };

    res.status(200).send(cleanedData);
  } catch (error) {
    res.status(500).send(message(error.message));
  }
}; 



// ---------- Admin action ------------------

//create new product
export const createProduct = async (req, res) => {
  try {

    const {variant, ...productData} = req.body;
 
    await db.runTransaction( async (transaction) => {
      
      const productCode = await transaction.get(db.collection(COLLECTIONS.PRODUCT).doc("productID"));
      const productID = "ES" + `${productCode.data().code}`.padStart(5, '0')
      const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);
      const currentTime =  admin.firestore.Timestamp.now()

      const newProductData = {
        ...productData,
        variant: variant,
        createdAt: currentTime, 
        updatedAt: currentTime
      }

      transaction.create(productRef, newProductData);
      transaction.update(db.collection(COLLECTIONS.PRODUCT).doc("productID"), {code: admin.firestore.FieldValue.increment(1)});

      for (const variantData of variant) {
        const variantID = `${variantData.color}`

        for (const size of productData.size){
          const sku = `${productID}_${variantID}_${size}`;
          const stockData = {
            productID: productID,
            variant: variantID,
            size: size,
            stock: 0,
          }
          transaction.create(db.collection(COLLECTIONS.STOCK).doc(sku), stockData);
        }
      };
    })

    res.status(200).send(message('product created successfully'));
  } catch (error) {
    res.status(500).send(message(error.message));
  }
};

// update product details ( with id)
export const updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const productExist = await getProductData(productID);
    console.log("fdfdfdfdf");
    if (!productExist){
      res.status(400).send(message(`Product ${productID} does not exist.`))
    }
    const productData = req.body;
    

    const newProductData = {
      updatedAt: admin.firestore.Timestamp.now(),
      ...productData
    }

    await db.collection(COLLECTIONS.PRODUCT).doc(productID).update(newProductData);
    res.status(200).send(message("Product Updated Succesfully."));

  } catch (error) {
    res.status(500).send(message(`${error.message}`));
  }
};

//delete product (with id)
export const deleteProduct = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID)

    await db.runTransaction(async (t) => {

      const stockQuery = db.collection(COLLECTIONS.STOCK)
        .orderBy(admin.firestore.FieldPath.documentId())
        .startAt(productID)
        .endAt(productID + '\uf8ff')

      const stockSnapshot = await stockQuery.get();
      const stockCount = await checkStock(stockSnapshot.docs);

      if (stockCount > 0){
        throw new Error(`There are ${stockCount} stock of this product remaining.`)
      } 

      stockSnapshot.forEach((stock) => {
        t.delete(stock.ref);
      });

      t.delete(productRef)
      return "Product Deleted"

    }).then((result) => {
      // Handle successful transaction
      res.status(200).send(message(result)); // Send success message
    }).catch((error) => {
      // Handle errors from transaction
      res.status(400).send(message(`Product Failed To Delete: ${error.message}`));
    });
  } catch (error) {
    res.status(500).send(message(error.message));
  }
};

export const addVariant = async (req, res) => {

  try {
    const productID = req.params.id;
    const variantData = req.body;
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);

    // Run Firestore transaction
    await db.runTransaction(async (t) => {

      const productData = await getProductData(productID, t);

      if (!productData) {
        throw new Error(`Product ${productID} does not exist.`)
      }
      console.log(productData)
      const productVariants = [...new Set(productData.variant.map((data) => data.color))];
      console.log(productVariants);

      // Check if the color already exists in the variants
      if (!productVariants.includes(variantData.color)) {
        const variantID = variantData.color;

        // Add new variant of the product as subcollection
        t.update(productRef, {
          variant: admin.firestore.FieldValue.arrayUnion(variantData),
        });

        // Create new SKU for the new variant
        for (const size of productData.size) {
          const sku = `${productID}_${variantID}_${size}`;
          const stockData = {
            productID: productID,
            variant: variantID,
            size: size,
            stock: 0,
          };
          t.create(db.collection(COLLECTIONS.STOCK).doc(sku), stockData);
        }

        // Transaction completed successfully, return response here
        return "Variant Created.";
      } else {
        // Variant already exists
        throw new Error("Variant Already Exists");
      }
    }).then((result) => {
      // Handle successful transaction
      res.status(200).send(message(result)); // Send success message
    }).catch((error) => {
      // Handle errors from transaction
      res.status(400).send(message(`New Variant Failed to Create: ${error.message}`));
    });
  } catch (error) {
    // Catch any errors outside of the transaction
    res.status(500).send(message(error.message));
  }
};

export const updateVariant = async (req, res) => {

  try {
    const productID = req.params.id;
    const variantData = req.body;
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);

    // Run Firestore transaction
    await db.runTransaction(async (t) => {

      const productData = await getProductData(productID, t);
      if (!productData) {
        throw new Error(`Product ${productID} does not exist.`)
      }

      const variantToRemove = productData.variant.find((variant) => variant.color === variantData.color);

      if (!variantToRemove) {
        new Error(`Variant with color ${colorToRemove} not found.`);
      }

      // Use Firestore's arrayRemove method to remove the element
      t.update(productRef, {
        variant: admin.firestore.FieldValue.arrayRemove(variantToRemove)
      });

      t.update(productRef, {
        variant: admin.firestore.FieldValue.arrayUnion(variantData)
      });

      return "Variant Updated."

    }).then((result) => {
      // Handle successful transaction
      res.status(200).send(message(result)); // Send success message
    }).catch((error) => {
      // Handle errors from transaction
      res.status(400).send(message(`${error.message}`));
    });
  } catch (error) {
    // Catch any errors outside of the transaction
    res.status(400).send(message(error.message));
  }
};

export const deleteVariant = async (req, res) => {

  try {
    const productID = req.params.productID;
    const variantID = req.params.variantID;
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);

    // Run Firestore transaction
    await db.runTransaction(async (t) => {
      const productData = await getProductData(productID, t);
      if (!productData) {
        throw new Error(`Product ${productID} does not exist.`)
      }

      // Querying the stock collection for each variant
      const stockSnapshot = await db.collection(COLLECTIONS.STOCK)
        .orderBy(admin.firestore.FieldPath.documentId())
        .startAt(`${productID}_${variantID}`)
        .endAt(`${productID}_${variantID}` + '\uf8ff')  // '\uf8ff' is the highest Unicode character, which helps fetch all documents starting with the variant ID
        .get();

      const stockCount = await checkStock(stockSnapshot.docs);

      if (stockCount > 0){
        throw new Error(`There are ${stockCount} stock of this variant remaining.`)
      }

      const variantToRemove = productData.variant.find((variant) => variant.color === variantID);
      if (!variantToRemove) {
        new Error(`Variant with color ${colorToRemove} not found.`);
      }

      // Use Firestore's arrayRemove method to remove the element
      t.update(productRef, {
        variant: admin.firestore.FieldValue.arrayRemove(variantToRemove)
      });

      // Loop through the stock snapshot and delete related stock documents
      stockSnapshot.forEach((stock) => {
        t.delete(stock.ref);
      });

      return "Variant Deleted."

    }).then((result) => {
      // Handle successful transaction
      res.status(200).send(message(result)); // Send success message
    }).catch((error) => {
      // Handle errors from transaction
      res.status(400).send(message(error.message));
    });
  } catch (error) {
    // Catch any errors outside of the transaction
    res.status(400).send(message(error.message));
  }
};

export const updateSize = async (req, res)=> {

  try {
    const productID = req.params.productID;
    const size = req.params.size;
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);

    // Run Firestore transaction
    await db.runTransaction(async (t) => {

      const productData = await getProductData(productID, t);
      if (!productData) {
        throw new Error(`Product ${productID} does not exist.`)
      }

      const productVariants = [...new Set(productData.variant.map((data) => data.color))];
      const productSize = productData.size;

      // Check if the color already exists in the variants
      if (!productSize.includes(size)) {
  
        // Add new variant of the product as subcollection
        t.update(productRef, {
          size: admin.firestore.FieldValue.arrayUnion(size),
        });

        for (const variant of productVariants){
          const sku = `${productID}_${variant}_${size}`;
          const stockData = {
            productID: productID,
            variant: variant,
            size: size,
            stock: 0,
          };
          t.create(db.collection(COLLECTIONS.STOCK).doc(sku), stockData);
        }

        // Transaction completed successfully, return response here
        return "New Size Updated.";
      } else {
        // Variant already exists
        throw new Error("Size Already Exists");
      }
    }).then((result) => {
      // Handle successful transaction
      res.status(200).send(message(result)); // Send success message
    }).catch((error) => {
      // Handle errors from transaction
      res.status(400).send(message(error.message));
    });
  } catch (error) {
    // Catch any errors outside of the transaction
    res.status(400).send(message(error.message));
  }
};

export const deleteSize = async (req, res) => {

  try {
    const productID = req.params.productID;
    const size = req.params.size;

    // Validate productID and size
    if (!productID || !size) {
      return res.status(400).send("Invalid productID or size.");
    }

    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(productID);

    // Run Firestore transaction
    await db.runTransaction(async (t) => {

      const productData = await getProductData(productID, t);
      if (!productData) {
        throw new Error(`Product ${productID} does not exist.`)
      }

      const productSize = productData.size;

      // Check if size exists in the product sizes
      if (productSize.includes(size)) {

        // Query the stock collection for documents starting with productID and ending with size
        const stockSnapshot = await db.collection(COLLECTIONS.STOCK)
          .where(admin.firestore.FieldPath.documentId(), '>=', `${productID}_`)
          .where(admin.firestore.FieldPath.documentId(), '<=', `${productID}_\uf8ff`)
          .get();

        // Filter stock documents ending with the specific size
        const filterStock = stockSnapshot.docs.filter(doc => doc.id.endsWith(`_${size}`));

        const stockCount = await checkStock(filterStock.map(doc => ({
          ...doc.data(), // Spread the document data
        })));

        if (stockCount > 0){
          throw new Error(`There are ${stockCount} stock of this product size remaining.`)
        }

        // Remove size from product document
        t.update(productRef, {
          size: admin.firestore.FieldValue.arrayRemove(size),
        });

        // Delete filtered stock documents
        filterStock.forEach((stock) => {
          t.delete(stock.ref);
        });

        return "Size Deleted.";
      } else {
        throw new Error("Size Does Not Exist");
      }
    })
    .then((result) => {
      res.status(200).send(message(result));
    })
    .catch((error) => {
      res.status(400).send(message(error.message));
    });
  } catch (error) {
    res.status(400).send(message(error.message));
  }
};
