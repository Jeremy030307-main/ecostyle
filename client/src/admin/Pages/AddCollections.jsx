import "./AddCollections.css";

import React, { useState, useEffect } from "react";
import { assets } from "../Components/Assets/assets";
import { Link } from "react-router-dom";
import { addCollection } from "../../apiManager/methods/collectionMethods";

const AddCollections = () => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const collection = {
        id: id,
        name: name,
        description: description
      };
      await addCollection(collection)
        .then(response => {
          console.log("Collection added successfully:", collection);
        })
        .catch(error => {
          console.error("Error adding collection:", error);
        });
    } catch (error) {
      console.log("Error Dumbbitch");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="add-form">
      {/* Images */}
      <div>
        <div className="title-container">
          <p className="title">Upload Image</p>
          <Link className="button-link" to="../collections">
            <button>
              <svg
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 1024 1024"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
            </button>
          </Link>
        </div>

        <div className="upload-images">
          <label className="upload-label" htmlFor="image1">
            <img
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
            />
          </label>
          <label className="upload-label" htmlFor="image2">
            <img
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
            />
          </label>
          <label className="upload-label" htmlFor="image3">
            <img
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
            />
          </label>
          <label className="upload-label" htmlFor="image4">
            <img
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
            />
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="w-full">
        <p className="upload-section">ID</p>
        <input
          onChange={(e) => setId(e.target.value)}
          value={id}
          className="input-field"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>

      {/* Title */}
      <div className="w-full">
        <p className="upload-section">Title</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="input-field"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="upload-section">Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="textarea-field"
          placeholder="Write Content Here"
          required
        ></textarea>
      </div>

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default AddCollections;
