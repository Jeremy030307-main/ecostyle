import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../Components/Assets/assets';
import "./Collections.css"
import { getAllCollection, deleteCollection, addCollection } from '../../apiManager/methods/collectionMethods';
import AlertDialog from '../Components/AlertDialog/AlertDialog';

const Collections = () => {

  const [collections, setCollections] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fetchCollections = async () => {
  
      try{
        const collection = await getAllCollection();
        console.log("All Collections Fetched", collection)
        setCollections(collection);
      } catch (error){
        console.error("Error fetching collection:", error);
      }
  
    }

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  // Handle product deletion
  const handleConfirmDelete = async (collectionId) => {
      try {
        await deleteCollection(collectionId); // Call deleteProduct API
        setCollections((prevList) => prevList.filter((item) => item.id !== collectionId));
        setIsAlertOpen(false);
        console.log("Collection deleted successfully");
      } catch (error) {
        console.error("Error deleting collection:", error.message || error);
      }
    
  };

  const test = async () => {
    addCollection("TEST2", "TESTNAME", "TESTDESC")
    .then(response => {
        console.log("New collection added:", response.data);
      })
      .catch(error => {
        console.error("Error:", error);
      })
  }

  // Fetch categories on component mount
  useEffect(() => {
    fetchCollections();
    // test();
  }, []);

  return (
    <>
      <div className="title-container">
        <p className='our-products'>Our Collections</p>
        <div>
            <NavLink className="add-product-button" to="/admin/addCollections">
                <img src={assets.add_icon} alt="" />
                <p className='button-word'>Add A Collection</p>
            </NavLink>
        </div>
      </div>
      
      <div className="product-list-container">
        {/* List Table Title */}
        <div className="product-list-header">
          <b>Name</b>
          <b className="action-header">Action</b>
        </div>

        {/* Product List */}
        {collections.map((item, index) => (
          <div className="product-item" key={index}>
            <p>{item.name}</p>
            <p onClick={() => handleDelete(item.id)} className="product-action">X</p>
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Are you absolutely sure?"
                message="This action cannot be undone. This will permanently delete your collection."
            />
          </div>
        ))}
      </div>
    </>

  )
}

export default Collections