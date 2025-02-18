// Collections.jsx
import React, { useEffect, useState } from "react";
import { assets } from "../../Components/Assets/assets";
import { getAllCollection, deleteCollection } from "../../../apiManager/methods/collectionMethods";
import AlertDialog from "../../Components/AlertDialog/AlertDialog";
import "./Collections.css";
import CollectionModal from "./CollectionModal";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  

  const fetchCollections = async () => {
    try {
      const collection = await getAllCollection();
      console.log("All Collections Fetched", collection);
      setCollections(collection);
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  const handleDelete = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCollectionId) {
      try {
        await deleteCollection(selectedCollectionId);
        setCollections((prevList) =>
          prevList.filter((item) => item.id !== selectedCollectionId)
        );
        setIsAlertOpen(false);
        console.log("Collection deleted successfully");
      } catch (error) {
        console.error("Error deleting collection:", error.message || error);
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="collections-container">
      <div className="collections-header">
        <h2 className="collections-title">Collections</h2>
        <div onClick={() => setModalOpen(true)} className="collections-add-button">
          <img src={assets.add_icon} alt="Add" className="collections-add-icon" />
          <span className="collections-add-text">Add A Collection</span>
        </div>
        <CollectionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.id} className="collections-item">
            <div className="collections-item-content">
              <span className="collections-item-name">{collection.name}</span>
              <div className="collections-item-actions">
                <img
                  className="collections-delete-button"
                  onClick={() => handleDelete(collection.id)}
                  src={assets.delete_icon}
                                  alt=""
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Collection"
        message="Are you sure you want to delete this collection?"
      />
    </div>
  );
};

export default Collections;