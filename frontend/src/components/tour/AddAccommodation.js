import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase'; // Adjust the path to your Firebase config
import "./AddAccommodation.css";

function AddAccommodation({ data, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    const updatedImages = [...(data.images || [])]; // Existing images

    files.forEach((file) => {
      const fileName = `${Date.now()}-${file.name}`; // Unique name for each image
      const storageRef = ref(storage, `accommodation-images/${fileName}`);

      setUploading(true); // Start uploading
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
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
            updatedImages.push(downloadURL); // Add uploaded URL to state
            onChange("images", updatedImages); // Update parent component
            setUploading(false);
          });
        }
      );
    });

    fileInputRef.current.value = null; // Clear input after upload
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = data.images.filter((_, i) => i !== index); // Remove from array
    const imageUrl = data.images[index];
    const fileName = imageUrl.split('%2F')[1].split('?')[0]; // Extract file name from URL
    const imageRef = ref(storage, `accommodation-images/${fileName}`);

    try {
      await deleteObject(imageRef); // Remove from Firebase storage
      onChange("images", updatedImages); // Update parent component
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="add-accommodation-container">
      <h3 className="section-title">Accommodation Details</h3>
      <form>
        <div className="accommodation-form-grid">
          <div>
            <label>Hotel / Lodge Name</label>
            <input
              type="text"
              placeholder="Hotel Sant"
              value={data.hotelName || ""}
              onChange={(e) => onChange("hotelName", e.target.value)}
            />
          </div>
          <div>
            <label>Costing Per Person (₹)</label>
            <input
              type="number"
              placeholder="2000"
              value={data.costing || ""}
              onChange={(e) => onChange("costing", e.target.value)}
            />
          </div>
          <div>
            <label>Checkin Time</label>
            <input
              type="datetime-local"
              value={data.checkin || ""}
              onChange={(e) => onChange("checkin", e.target.value)}
            />
          </div>
          <div>
            <label>Checkout Time</label>
            <input
              type="datetime-local"
              value={data.checkout || ""}
              onChange={(e) => onChange("checkout", e.target.value)}
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
              placeholder="Additional details about the accommodation"
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div>
            <label>Accommodation Images</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
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
            <label>Hotel Location</label>
            <input
              type="text"
              value={data.location || ""}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddAccommodation;



// import React, { useRef } from "react";
// import "./AddAccommodation.css";


// function AddAccommodation({ data, onChange }) {
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
//     <div className="add-accommodation-container">
//       <h3 className="section-title">Accommodation Details</h3>
//       <form>
//         <div className="accommodation-form-grid">
//           <div>
//             <label>Hotel / Lodge Name</label>
//             <input
//               type="text"
//               placeholder="Hotel Sant"
//               value={data.hotelName || ""}
//               onChange={(e) => onChange("hotelName", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Costing Per Person (₹)</label>
//             <input
//               type="number"
//               placeholder="2000"
//               value={data.costing || ""}
//               onChange={(e) => onChange("costing", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Checkin Time</label>
//             <input
//               type="datetime-local"
//               value={data.checkin || ""}
//               onChange={(e) => onChange("checkin", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Checkout Time</label>
//             <input
//               type="datetime-local"
//               value={data.checkout || ""}
//               onChange={(e) => onChange("checkout", e.target.value)}
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
//               placeholder="Additional details about the accommodation"
//               value={data.description || ""}
//               onChange={(e) => onChange("description", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Accommodation Images</label>
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
//             <label>Hotel Location</label>
//             <input
//               type="text"
//               value={data.location || ""}
//               onChange={(e) => onChange("location", e.target.value)}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AddAccommodation;
