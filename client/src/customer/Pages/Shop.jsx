import React, { useEffect, useState } from 'react'
import { getCategory } from '../../apiManager/methods/categoryMethods';

const Shop = () => {
  const [categoryData, setCategoryData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  
      useEffect(() => {
          const fetchCategory = async () => {
              try {
                const data = await getCategory();
                console.log(data)
                  
              } catch (err) {
                  setError(err.message); // Handle error
                  console.error(err);
              } finally {
                  setLoading(false); // Stop loading when request is done
              }
          };
  
          fetchCategory(); // Fetch data when component mounts or categoryID changes
      }, []); // Dependency array: only rerun if categoryID changes

  return (
    <div>Shop</div>
  )
}

export default Shop