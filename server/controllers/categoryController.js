const categoryCollection = 'category'
const subCategory = "subcategory"
import { db } from "../firebase.js";

export const getCategories = async (req, res) => {

    async function getSubcategories(categoryDocRef) {
        // Get subcollections of the category document (i.e., "subcategory")
        const subcategorySnapshot = await db.doc(categoryDocRef.path).collection(subCategory).get();
    
        let subcategories = [];
    
        if (!subcategorySnapshot.empty){
            // Iterate through each document in "category" collection
            for (const subcategoryDoc of subcategorySnapshot.docs) {
                const subcategoriesResult = await getSubcategories(subcategoryDoc.ref);
                const subcategoryData = {
                id : subcategoryDoc.id,
                ...subcategoryDoc.data(),
                ...(subcategoriesResult && subcategoriesResult.length > 0 && { subcategories: subcategoriesResult }),
                };
                subcategories.push(subcategoryData);
            }
            return subcategories;
        }
    
        return {}
    };

    try {
        const categorySnapshot = await db.collection(categoryCollection).get();

        let categories = [];

        // Iterate through each document in "category" collection
        for (const categoryDoc of categorySnapshot.docs) {
            const categoryData = {
            id : categoryDoc.id,
            ...categoryDoc.data(),
            subcategories: await getSubcategories(categoryDoc.ref) // Get subcategories with variants
            };
            categories.push(categoryData);
        }

        res.status(200).send(categories)

    } catch (error) {
        res.status(400).send(error.message)
    }
};

export const getCategory = async (req, res) => {

    const pathSegments = req.params[0].split('/'); // Split the wildcard path

    // Reformat the segments into the desired structure
    let formattedPath = `category/${pathSegments[0]}`;
    pathSegments.forEach((segment, index) => {
        if (index > 0) {
            formattedPath += `/subcategory/${segment}`;
        }
    });

    try {
        const q = db.collection('product').where("category", "array-contains", db.doc(formattedPath))

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
        const { subcategories, ...categoryData } = req.body;

        if (!categoryData) {
            return res.status(400).send({ error: "Category name is required." });
        }

        let formattedPath = `category`;
        if (subcategories && subcategories.length > 0) {
            subcategories.forEach((segment, index) => {
                formattedPath += `/${segment}/subcategory`;
            });
        }
        await db.collection(formattedPath).add(categoryData);
        res.status(200).send('Category added successfully');
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
        const { categoryIds } = req.body;

        // Check if categoryIds is an array and if it is nested (array of arrays)
        if (!categoryIds || !Array.isArray(categoryIds) || !categoryIds.every(item => Array.isArray(item))) {
            return res.status(400).send({ error: 'CategoryIds must be a 2-layer nested array.' });
        }

        // Optionally, check if the inner arrays have at least one element
        if (categoryIds.some(innerArray => innerArray.length === 0)) {
            return res.status(400).send({ error: 'Each category ID array must contain at least one ID.' });
        }

        categoryIds.forEach(async (id, index) => {
            let formattedPath = `category`;
            if (id && id.length > 0) {
                id.forEach((segment, index) => {
                    if (index == 0){
                        formattedPath += `/${segment}`
                    } else {
                        formattedPath += `/subcategory/${segment}`;
                    }
                });
            };
            console.log(formattedPath);
            // await db.doc(formattedPath).delete();
            await deleteDocumentRecursively(db.doc(formattedPath))
        });

        res.status(200).send("Category Delete Successfully");
      } catch (error) {
        res.status(400).send(error.message);
      }
};

