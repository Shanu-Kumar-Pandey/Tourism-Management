import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase'; 
import "./AddDestination.css";

function AddDestination({ data, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); 
    const updatedImages = [...(data.images || [])];

    files.forEach((file, index) => {
      const fileName = `${Date.now()}-${file.name}`; 
      const storageRef = ref(storage, `destination-images/${fileName}`);

      setUploading(true); 
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
         
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [fileName]: progress,
          }));
        },
        (error) => {
          console.error("Upload failed", error);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updatedImages.push(downloadURL); 
            onChange("images", updatedImages); // Update parent component
            setUploading(false);
          });
        }
      );
    });

    fileInputRef.current.value = null; 
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = data.images.filter((_, i) => i !== index); // Remove from array
    const imageUrl = data.images[index];
    const fileName = imageUrl.split('%2F')[1].split('?')[0]; // Extract file name from URL
    const imageRef = ref(storage, `destination-images/${fileName}`);

    try {
      await deleteObject(imageRef); // Remove from Firebase storage
      onChange("images", updatedImages); // Update parent component
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="add-destination-container">
      <h3 className="section-title">Destination Details</h3>
      <form>
        <div className="destination-form-grid">
          <div>
            <label>Country</label>
            <input
              type="text"
              placeholder="India"
              value={data.country || ""}
              onChange={(e) => onChange("country", e.target.value)}
              disabled
            />
          </div>
          <div>
            <label>State</label>
            <input
              type="text"
              placeholder="State"
              value={data.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              placeholder="City"
              value={data.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>
          <div>
            <label>ZipCode</label>
            <input
              type="number"
              placeholder="382210"
              value={data.zipCode || ""}
              onChange={(e) => onChange("zipCode", e.target.value)}
              maxLength={6}
            />
          </div>
          <div>
            <label>Street Name</label>
            <input
              type="text"
              placeholder="s.g highway"
              value={data.streetName || ""}
              onChange={(e) => onChange("streetName", e.target.value)}
            />
          </div>
          <div>
            <label>Select Rating</label>
            <input
              type="number"
              placeholder="5"
              value={data.rating || ""}
              onChange={(e) => onChange("rating", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the destination"
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div>
            <label>Destination Images</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {/* Display uploaded images */}
            {data.images && data.images.length > 0 && (
              <ul>
                {data.images.map((imageUrl, index) => (
                  <li key={index}>
                    <img
                      src={imageUrl}
                      alt={`Uploaded ${index}`}
                      style={{ width: "100px", marginRight: "10px" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* Display upload progress */}
            {uploading && (
              <ul>
                {Object.keys(uploadProgress).map((fileName) => (
                  <li key={fileName}>
                    Upload {fileName}: {uploadProgress[fileName]}%
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              placeholder="Price"
              value={data.price || ""}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDestination;




























// import React, { useRef } from "react";
// import "./AddDestination.css";




// function AddDestination({ data, onChange }) {
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     onChange("images", [...(data.images || []), ...files]);

//     fileInputRef.current.value = null;
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = data.images.filter((_, i) => i !== index);
//     onChange("images", updatedImages);
//   };

//   return (
//     <div className="add-destination-container">
//       <h3 className="section-title">Destination Details</h3>
//       <form>
//         <div className="destination-form-grid">
//           <div>
//             <label>Country</label>
//             <input
//               type="text"
//               placeholder="India"
//               value={data.country || ""}
//               onChange={(e) => onChange("country", e.target.value)}
//               disabled
//             />
//           </div>
//           <div>
//             <label>State</label>
//             <input
//               type="text"
//               placeholder="State"
//               value={data.state || ""}
//               onChange={(e) => onChange("state", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>City</label>
//             <input
//               type="text"
//               placeholder="City"
//               value={data.city || ""}
//               onChange={(e) => onChange("city", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>ZipCode</label>
//             <input
//               type="number"
//               placeholder="382210"
//               value={data.zipCode || ""}
//               onChange={(e) => onChange("zipCode", e.target.value)}
//               maxLength={6}
//             />
//           </div>
//           <div>
//             <label>Street Name</label>
//             <input
//               type="text"
//               placeholder="s.g highway"
//               value={data.streetName || ""}
//               onChange={(e) => onChange("streetName", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Select Rating</label>
//             <input
//               type="number"
//               placeholder="5"
//               value={data.rating || ""}
//               onChange={(e) => onChange("rating", e.target.value)}
//             />
//           </div>
//           <div className="full-width">
//             <label>Description</label>
//             <textarea
//               placeholder="Additional details about the destination"
//               value={data.description || ""}
//               onChange={(e) => onChange("description", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Destination Images</label>
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//             {data.images && data.images.length > 0 && (
//               <ul>
//                 {data.images.map((file, index) => (
//                   <li key={index}>
//                     {file.name}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveImage(index)}
//                       style={{
//                         marginLeft: "10px",
//                         color: "red",
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       -
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <div>
//             <label>Price</label>
//             <input
//               type="number"
//               placeholder="Price"
//               value={data.price || ""}
//               onChange={(e) => onChange("price", e.target.value)}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AddDestination;
