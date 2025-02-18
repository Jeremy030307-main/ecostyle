import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../authentication/authenticationManager";

// Function to upload an image to Firebase Storage
export const uploadImageToFirebase = (file, path = "products") => {
    
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file selected");
      return;
    }
    

    // const storage = getStorage();
    const fileName = `${path}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload Progress: ${progress.toFixed(2)}%`);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
