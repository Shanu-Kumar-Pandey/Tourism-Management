import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase'; 
import "./EditDestination.css";

function EditDestination({ dayDetails, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...(dayDetails.data.images || [])];

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
            onChange("images", updatedImages); 
            setUploading(false);
          });
        }
      );
    });

    fileInputRef.current.value = null; 
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = dayDetails.data.images.filter((_, i) => i !== index); 
    const imageUrl = dayDetails.data.images[index];


    const fileNameEncoded = imageUrl.split('%2F')[1].split('?')[0];
    const fileName = decodeURIComponent(fileNameEncoded); 
    const imageRef = ref(storage, `destination-images/${fileName}`);

    try {
      await deleteObject(imageRef); 
      onChange("images", updatedImages); 
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="edit-destination-container">
      <h3 className="section-title">Edit Destination Details</h3>
      <form>
              <div className="destination-form-grid">
           <div>
             <label>Country</label>
             <input
              type="text"
              placeholder="India"
              value={dayDetails?.data?.country || ""}
              onChange={(e) => onChange("country", e.target.value)}
                  disabled
            />
 </div>
<div>
<label>State</label>
<input
              type="text"
              placeholder="State"
              value={dayDetails?.data?.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              placeholder="City"
              value={dayDetails?.data?.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>
          <div>
            <label>ZipCode</label>
            <input
              type="number"
              placeholder="382210"
              value={dayDetails?.data?.zipCode || ""}
              onChange={(e) => onChange("zipCode", e.target.value)}
              maxLength={6}
            />
          </div>
          <div>
            <label>Street Name</label>
            <input
              type="text"
              placeholder="s.g highway"
              value={dayDetails?.data?.streetName || ""}
              onChange={(e) => onChange("streetName", e.target.value)}
            />
          </div>
          <div>
            <label>Select Rating</label>
            <input
              type="number"
              placeholder="5"
              value={dayDetails?.data?.rating || ""}
              onChange={(e) => onChange("rating", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the destination"
              value={dayDetails?.data?.description || ""}
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
            
            {dayDetails?.data?.images && dayDetails?.data?.images.length > 0 && (
              <ul>
                {dayDetails?.data?.images.map((imageUrl, index) => (
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
            <input               type="number"
              placeholder="Price"
             value={dayDetails?.data?.price || ""}
            onChange={(e) => onChange("price", e.target.value)}
          />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditDestination;



// import React, { useRef } from "react";
// import "./EditDestination.css";

// function EditDestination({ dayDetails, onChange }) {
//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     onChange("images", [...(dayDetails.images || []), ...files]);

//     fileInputRef.current.value = null;
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = dayDetails.images.filter((_, i) => i !== index);
//     onChange("images", updatedImages);
//   };

//   return (
//     <div className="edit-destination-container">
      
//       <h3 className="section-title">Edit Destination Details</h3>
//       <form>
//         <div className="destination-form-grid">
//           <div>
//             <label>Country</label>
//             <input
//               type="text"
//               placeholder="India"
//               value={dayDetails?.data?.country || ""}
//               onChange={(e) => onChange("country", e.target.value)}
//               disabled
//             />
//           </div>
//           <div>
//             <label>State</label>
//             <input
//               type="text"
//               placeholder="State"
//               value={dayDetails?.data?.state || ""}
//               onChange={(e) => onChange("state", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>City</label>
//             <input
//               type="text"
//               placeholder="City"
//               value={dayDetails?.data?.city || ""}
//               onChange={(e) => onChange("city", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>ZipCode</label>
//             <input
//               type="number"
//               placeholder="382210"
//               value={dayDetails?.data?.zipCode || ""}
//               onChange={(e) => onChange("zipCode", e.target.value)}
//               maxLength={6}
//             />
//           </div>
//           <div>
//             <label>Street Name</label>
//             <input
//               type="text"
//               placeholder="s.g highway"
//               value={dayDetails?.data?.streetName || ""}
//               onChange={(e) => onChange("streetName", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Select Rating</label>
//             <input
//               type="number"
//               placeholder="5"
//               value={dayDetails?.data?.rating || ""}
//               onChange={(e) => onChange("rating", e.target.value)}
//             />
//           </div>
//           <div className="full-width">
//             <label>Description</label>
//             <textarea
//               placeholder="Additional details about the destination"
//               value={dayDetails?.data?.description || ""}
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
//             {dayDetails?.images && dayDetails?.images.length > 0 && (
//               <ul>
//                 {dayDetails?.images.map((file, index) => (
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
//               value={dayDetails?.data?.price || ""}
//               onChange={(e) => onChange("price", e.target.value)}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditDestination;
