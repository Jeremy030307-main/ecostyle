import admin from 'firebase-admin';
import { db } from "../firebase.js";
import { COLLECTIONS, message } from "./utility.js";

const convertIdToRef = (categoryID) => {

    const pathSegments = categoryID.split('_'); // split the parent id in between _
    let path = null
    let tmp = pathSegments[0]
    path = db.collection(COLLECTIONS.CATEGORY).doc(tmp)
    pathSegments.slice(1).forEach((segment, index) => {
        tmp += '_' + segment
        path = path.collection(COLLECTIONS.SUBCATEGORY).doc(tmp)
    });

    return path
}

export const getSizeGuide = async (categoryID, transaction) => {
    try {
      const pathSegments = categoryID.split('_');
      let tmp = pathSegments[0];
      let pathRef = db.collection(COLLECTIONS.CATEGORY).doc(tmp);
  
      for (let i = 0; i < pathSegments.length; i++) {
        const docSnapshot = await transaction.get(pathRef);
  
        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          if (data && data.size_guide) {
            return data.size_guide ;
          }
        }
  
        if (i < pathSegments.length - 1) {
          tmp += `_${pathSegments[i + 1]}`;
          pathRef = pathRef.collection(COLLECTIONS.SUBCATEGORY).doc(tmp);
        }
      }
  
      return null; // No size guide found
    } catch (error) {
      console.error("Error fetching size guide:", error);
      throw new Error("Failed to retrieve size guide");
    }
  };

export const checkCategory = async (body) => {
    try {
        // Check if at least one field is present (in this case, 'collection')
        if (!body || !body.category) {
            return { isValid: true, message: null };
        }
        // Reference to the document in the "category" collection
        const categoryRef = convertIdToRef(body.category);
        const categoryDoc = await categoryRef.get();
 
        if (!categoryDoc.exists) {
            return { isValid: false, message: 'Category does not exist' };
          }
        
          return { isValid: true, message: null };  // Valid category
    } catch (error) {
        console.error('Error checking category:', error);
        throw new Error(`Unable to check category existence: ${error.message}`);
    }
};

export const getCategories = async (req, res) => {

    // Helper function to get subcategories recursively
    async function getSubcategories(categoryDocRef) {
        // Get subcollections of the category document (i.e., "subcategory")
        const subcategorySnapshot = await db.doc(categoryDocRef.path).collection(COLLECTIONS.SUBCATEGORY).get();
    
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
            const categorySnapshot = await db.collection(COLLECTIONS.CATEGORY).get();

            if (categorySnapshot.empty) {
                return res.status(404).send(message('No categories found.'));
            }

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
            const docRef = convertIdToRef(categoryID);

            const categorySnapshot = await docRef.get();
            if (!categorySnapshot.exists) {
                return res.status(404).send(message('No Collection found'));
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
        res.status(500).send(message(error.message));  // Use status 500 for server errors
    }
}; 

// ---------- Admin action ------------------

export const addCategory = async (req, res, next) => {
    const addCategoryToFirestore = async (data, parentID, batch) => {

        const {name,id, subcategories, ...categoryData} = data;
    
        let categoryID = id;
        if (!!parentID) {
            categoryID = parentID + "_" + categoryID
        };
        
        // Step 1: Add the main category document
        const path = convertIdToRef(categoryID);
        batch.create(path, {name: name, ...categoryData})
        // await path.create({name: name, ...categoryData});
        console.log(`Added category: ${data.name} in collection: ${path.path}`);
      
        // Step 2: Process subcategory if it exists
        if (!!subcategories) {
            for (const sub of subcategories) {
                await addCategoryToFirestore(sub, categoryID, batch);
            }
        }
    };

    try{ 
        const data = req.body;
        const parentId = req.params.parentID;

        let categoryID = data.id;
        if (!!parentId) {
            const exist = await checkCategory({category: parentId})
            if (!exist.isValid){
                return res.status(400).send(message(`Parent Category with ID ${parentId} does not exist.`))
            }
            categoryID = parentId + "_" + categoryID
        };

        const exist = await checkCategory({category: categoryID});
        if (exist.isValid){
            return res.status(400).send(message(`Category with ID ${categoryID} already exist.`))
        }

        console.log(data)
        const batch = db.batch();

        await addCategoryToFirestore(data, parentId, batch);
        await batch.commit(); 

        res.status(201).send(message("Category created"));
    } catch (error) {
        res.status(500).send(message(error.message))
    }   
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { size_guide } = req.body;

        if (!categoryId) {
            return res.status(400).send(message("Missing category ID"));
        }

        const categoryRef = convertIdToRef(categoryId);

        // Check if the document exists
        const docSnapshot = await categoryRef.get();
        if (!docSnapshot.exists) {
            return res.status(404).send(message(`Category with ID ${categoryId} not found`));
        }

        // Use spread operator to pass individual objects to arrayUnion
        await categoryRef.update({
            size_guide: admin.firestore.FieldValue(...size_guide)
        });

        res.status(200).send(message("Category Information Updated"));
    } catch (error) {
        res.status(400).send(message(`Category Information Failed to Update: ${error.message}`));
    }
};

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
            return res.status(400).send(message('Missing CategoryID'));
        }

        const exist = await checkCategory({category: categoryId});
        if (!exist.isValid){
            return res.status(400).send(message(`Category with ID ${categoryId} does not exist.`))
        }

        // Check if any product under this category
        const q = db.collection("product")
                    .where("category", ">=", categoryId)
                    .where("category", "<", categoryId + "\uf8ff")
        const querySnapshot = await q.count().get();

        if (querySnapshot.data().count > 0){
            return res.status(409).send(message(`There are ${querySnapshot.data().count} products under this collection.`))
        };

        const path = convertIdToRef(categoryId);
        await deleteDocumentRecursively(path);
        res.status(204).send(message("Category Delete Successfully"));

      } catch (error) {
        res.status(500).send(message(error.message));
      }
};
 