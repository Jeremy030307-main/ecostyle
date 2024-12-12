const categoryCollection = 'category'
const subCategory = "subcategory"
import { json } from "express";
import { db } from "../firebase.js";

const convertIdToPath = (categoryID) => {

    const pathSegments = categoryID.split('_'); // split the parent id in between _

    let tmp = pathSegments[0]
    let path = db.collection(categoryCollection).doc(tmp)
    pathSegments.slice(1).forEach((segment, index) => {
        tmp += '_' + segment
        path = path.collection(subCategory).doc(tmp)
    });

    return path
}

export const getCategories = async (req, res) => {

    // Helper function to get subcategories recursively
    async function getSubcategories(categoryDocRef) {
        // Get subcollections of the category document (i.e., "subcategory")
        const subcategorySnapshot = await db.doc(categoryDocRef.path).collection(subCategory).get();
    
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
        // Fetch top-level categories
        const categorySnapshot = await db.collection(categoryCollection).get();

        let categories = [];

        // Iterate through each document in the "category" collection
        for (const categoryDoc of categorySnapshot.docs) {
            const categoryData = {
                id: categoryDoc.id,
                ...categoryDoc.data(),
                subcategories: await getSubcategories(categoryDoc.ref), // Get subcategories recursively
            };
            categories.push(categoryData);
        }

        // Send the result as the response
        res.status(200).send(categories);

    } catch (error) {
        console.error('Error fetching categories:', error);  // Log the error for debugging
        res.status(500).send({ error: error.message });  // Use status 500 for server errors
    }
};

export const getCategory = async (req, res) => {

    try {

        const categoryID = req.params.id; // Split the wildcard path

        const q = db.collection('product').where("category", "array-contains", categoryID)

        const querySnapshot = await q.get();
        const productArray = querySnapshot.docs.map((doc) => {
            const {category, collection, ...productData} = doc.data();
      
            return {
              id: doc.id,
              ...productData,
            };
          });
      
        res.status(200).send(productArray);

    } catch (error) {
        res.status(400).send(error.message)
    }
};

// ---------- Admin action ------------------
export const addCategory = async (req, res, next) => {
    try{ 
        const {name, parentId} = req.body;

        let categoryID = name.replace(/\s+/g, '').toLowerCase();

        if (!!parentId) {
            categoryID = parentId + "_" + categoryID
        };

        const path = convertIdToPath(categoryID);
        console.log(path.path)
        await path.create({name: name});

        res.status(200).send("Category created");

    } catch (error) {
        res.status(400).send(error.message)
    }   
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
    
            // Delete the current document (once its subcollections are deleted)
            await docRef.delete();
            console.log(`Deleted document: ${docRef.path}`);
        } catch (error) {
            console.error(`Error deleting document ${docRef.path}:`, error);
        }
    };
    
    try {
        const categoryId = req.params.id;

        // Check if categoryIds is an array and if it is nested (array of arrays)
        if (!categoryId) {
            return res.status(400).send({ error: 'Missing CategoryID' });
        }

        const path = convertIdToPath(categoryId);

        console.log(path.path)
        await deleteDocumentRecursively(path);
        res.status(200).send("Category Delete Successfully");
      } catch (error) {
        res.status(400).send(error.message);
      }
};

