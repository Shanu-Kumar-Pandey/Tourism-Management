import React, { useRef, useState } from "react";
import "./AddActivities.css";
import { storage } from '../../firebase'; // Adjust the import based on your Firebase setup
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddActivities({ data, onChange }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Optional: To show upload progress

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true); // Start loading state

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `activities/${file.name}`);
        await uploadBytes(storageRef, file, {
          onProgress: (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress); // Update progress (optional)
          },
        });
        const url = await getDownloadURL(storageRef);
        return url; // Get the download URL for the uploaded file
      })
    );

    onChange("images", [...(data.images || []), ...imageUrls]);
    setLoading(false); // Stop loading state
    fileInputRef.current.value = null; // Clear the file input
  };

  const handleRemoveImage = (index) => {
    const updatedImages = data.images.filter((_, i) => i !== index);
    onChange("images", updatedImages);
  };

  return (
    <div className="add-activities-container">
      <h3 className="section-title">Activities Details</h3>
      <form>
        <div className="activities-form-grid">
          <div>
            <label>Activity Title</label>
            <input
              type="text"
              placeholder="Activity Title"
              value={data.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>
          <div>
            <label>Activity Type</label>
            <input
              type="text"
              placeholder="Rides"
              value={data.type || ""}
              onChange={(e) => onChange("type", e.target.value)}
            />
          </div>
          <div>
            <label>Places Covered</label>
            <input
              type="text"
              placeholder="Temple"
              value={data.placesCovered || ""}
              onChange={(e) => onChange("placesCovered", e.target.value)}
            />
          </div>
          <div>
            <label>Duration</label>
            <input
              type="time"
              value={data.duration || ""}
              onChange={(e) => onChange("duration", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the activities"
              value={data.description || ""}
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
            {loading && <p>Uploading... {uploadProgress}%</p>} {/* Optional: Show progress */}
            {data.images && data.images.length > 0 && (
              <ul>
                {data.images.map((url, index) => (
                  <li key={index}>
                    <img src={url} alt={`Activity ${index}`} style={{ width: '50px', height: '50px' }} /> {/* Optional: Show thumbnail */}
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
                      -
                    </button>
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
              value={data.location || ""}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
         
        </div>
      </form>
    </div>
  );
}

export default AddActivities;


// import React, { useRef } from "react";
// import "./AddActivities.css";

// function AddActivities({ data, onChange }) {
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
//     <div className="add-activities-container">
//       <h3 className="section-title">Activities Details</h3>
//       <form>
//         <div className="activities-form-grid">
//           <div>
//             <label>Activity Title</label>
//             <input
//               type="text"
//               placeholder="Activity Title"
//               value={data.title || ""}
//               onChange={(e) => onChange("title", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Activity Type</label>
//             <input
//               type="text"
//               placeholder="Rides"
//               value={data.type || ""}
//               onChange={(e) => onChange("type", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Places Covered</label>
//             <input
//               type="text"
//               placeholder="Temple"
//               value={data.placesCovered || ""}
//               onChange={(e) => onChange("placesCovered", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Duration</label>
//             <input
//               type="time"
//               value={data.duration || ""}
//               onChange={(e) => onChange("duration", e.target.value)}
//             />
//           </div>
//           <div>
//             <label>Location</label>
//             <input
//               type="text"
//               placeholder="Location"
//               value={data.location || ""}
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
//           <div className="full-width">
//             <label>Description</label>
//             <textarea
//               placeholder="Additional details about the activities"
//               value={data.description || ""}
//               onChange={(e) => onChange("description", e.target.value)}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AddActivities;
