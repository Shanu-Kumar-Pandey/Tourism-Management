import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase';
import "./EditActivities.css";

function EditActivities({ dayDetails, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...(dayDetails.data.images || [])]; // Store existing images

    files.forEach((file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `activities/${fileName}`);

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
            onChange("images", updatedImages); // Update images in parent state
            setUploading(false);
          });
        }
      );
    });

    fileInputRef.current.value = null; // Clear file input
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = dayDetails.data.images.filter((_, i) => i !== index);
    const imageUrl = dayDetails.data.images[index];

    // Extract file name from the Firebase URL
    const fileNameEncoded = imageUrl.split('%2F')[1].split('?')[0];
    const fileName = decodeURIComponent(fileNameEncoded);
    const imageRef = ref(storage, `activities/${fileName}`);

    try {
      await deleteObject(imageRef); // Delete image from Firebase Storage
      onChange("images", updatedImages); // Update state after removal
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="edit-activities-container">
      {console.log(dayDetails)}
      <h3 className="section-title">Edit Activities Details</h3>
      <form>
        <div className="activities-form-grid">
          <div>
            <label>Activity Title</label>
            <input
              type="text"
              placeholder="Activity Title"
              value={dayDetails?.data?.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>
          <div>
            <label>Activity Type</label>
            <input
              type="text"
              placeholder="Rides"
              value={dayDetails?.data?.type || ""}
              onChange={(e) => onChange("type", e.target.value)}
            />
          </div>
          <div>
            <label>Places Covered</label>
            <input
              type="text"
              placeholder="Temple"
              value={dayDetails?.data?.placesCovered || ""}
              onChange={(e) => onChange("placesCovered", e.target.value)}
            />
          </div>
          <div>
            <label>Duration</label>
            <input
              type="time"
              value={dayDetails?.data?.duration || ""}
              onChange={(e) => onChange("duration", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the activities"
              value={dayDetails?.data?.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
         
          <div>
            <label>Activities Images</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {dayDetails?.data?.images && dayDetails.data.images.length > 0 && (
              <ul>
                {dayDetails.data.images.map((imageUrl, index) => (
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
            <label>Location</label>
            <input
              type="text"
              placeholder="Location"
              value={dayDetails?.data?.location || ""}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditActivities;


// import React, { useRef } from "react";
// import "./EditActivities.css";

// function EditActivities({ dayDetails, onChange }) {
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
//     <div className="edit-activities-container">
//         {console.log(dayDetails)}
//       <h3 className="section-title">Edit Activities Details</h3>
//       <form>
//         <div className="activities-form-grid">
//           <div>
//             <label>Activity Title</label>
//             <input
//               type="text"
//               placeholder="Activity Title"
//               value={dayDetails?.data?.title || ""}
//               onChange={(e) => onChange("title", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Activity Type</label>
//             <input
//               type="text"
//               placeholder="Rides"
//               value={dayDetails?.data?.type || ""}
//               onChange={(e) => onChange("type", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Places Covered</label>
//             <input
//               type="text"
//               placeholder="Temple"
//               value={dayDetails?.data?.placesCovered || ""}
//               onChange={(e) => onChange("placesCovered", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Duration</label>
//             <input
//               type="time"
//               value={dayDetails?.data?.duration || ""}
//               onChange={(e) => onChange("duration", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Location</label>
//             <input
//               type="text"
//               placeholder="Location"
//               value={dayDetails?.data?.location || ""}
//               onChange={(e) => onChange("location", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Activities Images</label>
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//             {dayDetails?.images && dayDetails.images.length > 0 && (
//               <ul>
//                 {dayDetails.images.map((file, index) => (
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
//           <div className="full-width">
//             <label>Description</label>
//             <textarea
//               placeholder="Additional details about the activities"
//               value={dayDetails?.data?.description || ""}
//               onChange={(e) => onChange("description", e.target.value)}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditActivities;
