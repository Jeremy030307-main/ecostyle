import { db } from "../firebase.js";
import admin from 'firebase-admin'
import { COLLECTIONS, message } from "./utility.js"; 

export const checkProduct = async (body) => {
  try {
    console.log("fdfdfdsfsd")
    // Ensure the body and product are provided
    if (!body || !body.product) {
      return { isValid: true, errorMessage: null };
    }

    // Reference to the document in the "product" collection
    const productRef = db.collection(COLLECTIONS.PRODUCT).doc(body.product);
    const productDoc = await productRef.get();

    // Check if the product document exists
    if (!productDoc.exists) {
      return { isValid: false, errorMessage: 'Product does not exist' };
    }

    const productData = productDoc.data(); // Retrieve product data

    // Check if the body includes a size and validate it against product sizes
    if (body.size) {
      if (!productData.sizes || !Array.isArray(productData.sizes)) {
        return { isValid: false, errorMessage: 'Product sizes are not defined or invalid.' };
      }
      if (!productData.sizes.includes(body.size)) {
        return { isValid: false, errorMessage: `Size "${body.size}" is not available for this product.` };
      }
    }

    // Check if the body includes a variant and validate it against product variants
    if (body.variant) {
      if (!productData.variants || !Array.isArray(productData.variants)) {
        return { isValid: false, errorMessage: 'Product variants are not defined or invalid.' };
      }

      const variantColors = productData.variants.map(variant => variant.color);
      if (!variantColors.includes(body.variant)) {
        return { isValid: false, errorMessage: `Variant color "${body.variant}" is not available for this product.` };
      }
    }

    // All checks passed
    return { isValid: true, errorMessage: null };
  } catch (error) {
    console.error('Error checking product:', error);
    throw new Error(`Unable to check product existence: ${error.message}`);
  }
};


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

export const getProducts = async (req, res) => {
  // Extract query parameters for filtering and sorting
  const { category, collection, color, sortBy, orderBy } = req.query;

  try {
    let query = db.collection(COLLECTIONS.PRODUCT);

    if (category) {
      query = query.where('category', '>=', category).where('category', '<=', category + '\uf8ff');
    }

    if (collection) {
      query = query.where('collection', '==', collection);
    }

    if (color) {
      query = query.where('color', 'array-contains-any', color.split(','));
    }

    if (sortBy) {
      if (orderBy === 'asc' || orderBy === 'desc') {
        query = query.orderBy(sortBy, orderBy); // Apply sorting with specified order
      } else {
        query = query.orderBy(sortBy); // Default to ascending order if orderBy is invalid or undefined
      }
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Content-Encoding', "none");
    res.flushHeaders(); // Flush headers to establish SSE connection

    // Firestore Snapshot Listener
    const unsubscribe = query.onSnapshot(
      async (snapshot) => {

        if (snapshot.empty) {
          res.write(`event: error\ndata: ${JSON.stringify({ message: 'No Products found' })}\n\n`);
          return;
        }

        // Process product data
        const products = await Promise.all(
          snapshot.docs
            .filter((doc) => doc.id !== 'productID')
            .map(async (doc) => {
              const productData = doc.data();

              // Fetch colors: list of document IDs
              const variant = await getVariantDetails(productData.variant);

              return {
                id: doc.id,
                name: productData.name,
                price: productData.price,
                thumbnail: productData.thumbnail,
                variant: variant,
                size: productData.size,
                rating: productData.rating || null,
                reviewCount: productData.reviewCount || null,
              };
            })
        );


        // Stream updated products to the client
        res.write(`data: ${JSON.stringify(products)}\n\n`);
      },
      (error) => {
        // Handle Firestore listener errors
        console.error('Firestore listener error:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      }
    );

    // Cleanup when the client disconnects
    req.on('close', () => {
      console.log('Client disconnected');
      unsubscribe(); // Stop Firestore listener
      res.end();
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error setting up SSE:', error);
    res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    res.end();
  }
};

//get product by id
export const getProduct = (req, res, next) => {
  try {
    const id = req.params.id;

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Content-Encoding', "none");
    res.flushHeaders(); // Flush headers to establish SSE connection

    // Start listening to Firestore document changes
    const unsubscribe = db.collection(COLLECTIONS.PRODUCT).doc(id).onSnapshot(
      async (snapshot) => {
        if (!snapshot.exists) {
          res.write(`event: error\ndata: ${JSON.stringify({ error: 'Product not found' })}\n\n`);
          return;
        }

        const productData = snapshot.data();
        const variant = await getVariantDetails(productData.variant);

        // Clean and format the product data
        const cleanedData = {
          id: snapshot.id,
          name: productData.name,
          details: productData.details,
          price: productData.price,
          thumbnail: productData.thumbnail,
          variant: variant,
          size: productData.size,
          rating: productData.rating || null,
          reviewCount: productData.reviewCount || null,
        };

        // Send the updated product data to the client
        res.write(`data: ${JSON.stringify(cleanedData)}\n\n`);
      },
      (error) => {
        console.error("Error listening to product changes:", error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      }
    );

    // Handle connection close and clean up listener
    req.on('close', () => {
      unsubscribe(); // Stop listening to Firestore changes
      res.end();
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
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

      const productVariants = [...new Set(variant.map((data) => data.color))];

      const newProductData = {
        ...productData,
        color: productVariants,
        variant: variant,
      };

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

    await db.collection(COLLECTIONS.PRODUCT).doc(productID).update(productData);
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

      // Check if the color already exists in the variants
      const productVariants = productData.color
      if (!productVariants.includes(variantData.color)) {
        const variantID = variantData.color;

        // Add new variant of the product as subcollection
        t.update(productRef, {
          color: admin.firestore.FieldValue.arrayUnion(variantData.color),
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
        new Error(`Variant with color ${variantID} not found.`);
      }

      // Use Firestore's arrayRemove method to remove the element
      t.update(productRef, {
        color: admin.firestore.FieldValue.arrayRemove(variantID),
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
