import { db } from "../firebase.js";
const collection = 'collection'

export const addCollection = async (req, res, next) => {
    try{ 
        const {name} = req.body;


        if (!name) {
            res.status(400).send("Missing Collection Name")
        };

        console.log(path.path)
        await db.collection(collection).doc(name.toLowerCase()).create({name: name});

        res.status(200).send("Category created");

    } catch (error) {
        res.status(400).send(error.message)
    }   
}