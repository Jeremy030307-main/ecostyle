import { json } from "express";
import { db } from "../firebase.js";
import admin from 'firebase-admin'

const categoryCollection = 'category'
const subCategoryCollection = "subcategory"

const convertIdToRef = (categoryID) => {

    const pathSegments = categoryID.split('_'); // split the parent id in between _
    let path = null
    let tmp = pathSegments[0]
    path = db.collection(categoryCollection).doc(tmp)
    pathSegments.slice(1).forEach((segment, index) => {
        tmp += '_' + segment
        path = path.collection(subCategoryCollection).doc(tmp)
    });

    console.log(path.path)
    return path
}

export const checkCategory = async (body) => {
    try {
        // Reference to the document in the "category" collection
        const categoryRef = convertIdToRef(body.category);
        const categoryDoc = await categoryRef.get();
 
        if (!categoryDoc.exists) {
            return { isValid: false, errorMessage: 'Category does not exist' };
          }
        
          return { isValid: true, errorMessage: null };  // Valid category
    } catch (error) {
        console.error('Error checking category:', error);
        throw new Error(`Unable to check category existence: ${error.message}`);
    }
};

export const getCategories = async (req, res) => {

    // Helper function to get subcategories recursively
    async function getSubcategories(categoryDocRef) {
        // Get subcollections of the category document (i.e., "subcategory")
        const subcategorySnapshot = await db.doc(categoryDocRef.path).collection(subCategoryCollection).get();
    
        let subcategories = [];
    
        if (!subcategorySnapshot.empty) {
            // Iterate through each document in "subcategory" collection
            for (const subcategoryDoc of subcategorySnapshot.docs) {
                // Recursively get subcategories of this subcategory
                const subcategoriesResult = await getSubcategories(subcategoryDoc.ref);
                const subcategoryData = {
                    id: subcategoryDoc.id,
                    ...subcategoryDoc.data(),
                    ...(subcategoriesResult && subcategoriesResult.length > 0 && { subcategories: subcategoriesResult }),
                };
                subcategories.push(subcategoryData);
            }
        }
        return subcategories;  // Return an empty array if no subcategories are found
    }

    try {

        const categoryID = req.params.id;
        let categories = null;

        if (!categoryID){
            // Fetch top-level categories
            const categorySnapshot = await db.collection(categoryCollection).get();

            categories = [];

            // Iterate through each document in the "category" collection
            for (const categoryDoc of categorySnapshot.docs) {
                const categoryData = {
                    id: categoryDoc.id,
                    ...categoryDoc.data(),
                    subcategories: await getSubcategories(categoryDoc.ref), // Get subcategories recursively
                };
                categories.push(categoryData);
            }
        } else {
            const docRef = convertIdToRef(categoryID)

            const categorySnapshot = await docRef.get();
            if (categorySnapshot.empty) {
                res.status(400).send('No Collection found');
            } 

            categories = {
                id: categorySnapshot.id,
                ...categorySnapshot.data(),
                subcategories: await getSubcategories(categorySnapshot.ref) // Get subcategories recursively
            };
        }

        // Send the result as the response
        res.status(200).send(categories);

    } catch (error) {
        console.error('Error fetching categories:', error);  // Log the error for debugging
        res.status(500).send({ error: error.message });  // Use status 500 for server errors
    }
};

// ---------- Admin action ------------------

export const addCategory = async (req, res, next) => {

    const addCategoryToFirestore = async (data, parentID, batch) => {

        const {name,code, subcategory, ...categoryData} = data;
        
        if (!name) {
          throw new Error("Invalid category data. 'name' field is required.");
        }
    
        let categoryID = code;
        if (!!parentID) {
            categoryID = parentID + "_" + categoryID
        };
        
        // Step 1: Add the main category document
        const path = convertIdToRef(categoryID);
        batch.set(path, {name: name, ...categoryData})
        // await path.create({name: name, ...categoryData});
        console.log(`Added category: ${data.name} in collection: ${path.path}`);
      
        // Step 2: Process subcategory if it exists
        if (!!subcategory) {
            if (Array.isArray(subcategory)) {
                for (const sub of subcategory) {
                    await addCategoryToFirestore(sub, categoryID, batch);
                }
            } else {
                // If subcategory is not an array, return array
                throw new Error("Subcategory have to be an array.");
            }
        }
    };

    try{ 
        const data = req.body;
        const parentId = req.params.parentID;
        const batch = db.batch();

        await addCategoryToFirestore(data, parentId, batch);
        await batch.commit(); 

        res.status(200).send("Category created");
    } catch (error) {
        res.status(400).send(error.message)
    }   
}

export const updateCategory = async (req, res) => {
}

export const deleteCategory = async(req, res, next) => {

    const deleteDocumentRecursively = async (docRef) => {
        try {
            // List all subcollections of the document
            const subcollections = await docRef.listCollections();
    
            for (const subcollection of subcollections) {
                const subcollectionDocs = await subcollection.get();
    
                // Iterate and delete documents in the subcollection
                for (const subDoc of subcollectionDocs.docs) {
                    // Recursive call for nested subcollections
                    await deleteDocumentRecursively(subDoc.ref);
                }
            }

            await docRef.delete();
            console.log(`Deleted document: ${docRef.path}`);
        } catch (error) {
            console.error(`Error deleting document ${docRef.path}:`, error);
        }
    };
    
    try {
        const categoryId = req.params.id;

        if (!categoryId) {
            return res.status(400).send({ error: 'Missing CategoryID' });
        }

        // Check if any product under this category
        const q = db.collection("product")
                    .where("category", ">=", categoryId)
                    .where("category", "<", categoryId + "\uf8ff")
        const querySnapshot = await q.count().get();

        if (querySnapshot.data().count > 0){
            return res.status(400).send({error: "Cateogry unable to remove.", message: `There are ${querySnapshot.data().count} products under this collection.`})
        };

        const path = convertIdToRef(categoryId);
        await deleteDocumentRecursively(path);
        res.status(200).send("Category Delete Successfully");

      } catch (error) {
        res.status(400).send(error.message);
      }
};
