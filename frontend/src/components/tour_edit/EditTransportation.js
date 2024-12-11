import React from "react";
import "./EditTransportation.css"; 

function EditTransportation({ dayDetails, onChange }) {
  return (



    <div className="edit-transportation-container">
    {console.log(dayDetails)}

      <h3 className="section-title">Edit Transportation</h3>


      <form>
        <div className="transportation-form-grid">
          <div>
            <label>Transportation Type</label>
            <input
              type="text"
              placeholder="Flight, Bus, Train"
              value={dayDetails?.data?.transportation_type || ""}
              onChange={(e) => onChange("transportation_type", e.target.value)}
            />
          </div>
          <div>
            <label>Transportation Company</label>
            <input
              type="text"
              placeholder="Indigo, Air-Asia"
              value={dayDetails?.data?.company || ""}
              onChange={(e) => onChange("company", e.target.value)}
            />
          </div>
          <div>
            <label>Departure Date & Time</label>
            <input
              type="datetime-local"
              value={dayDetails?.data?.departureDateTime || ""}
              onChange={(e) => onChange("departureDateTime", e.target.value)}
            />
          </div>
          <div>
            <label>Arrival Date & Time</label>
            <input
              type="datetime-local"
              value={dayDetails?.data?.arrivalDateTime || ""}
              onChange={(e) => onChange("arrivalDateTime", e.target.value)}
            />
          </div>
          <div>
            <label>Departure Location</label>
            <input
              type="text"
              placeholder="Ahmedabad Airport / Railway station"
              value={dayDetails?.data?.departureLocation || ""}
              onChange={(e) => onChange("departureLocation", e.target.value)}
            />
          </div>
          <div>
            <label>Arrival Location</label>
            <input
              type="text"
              placeholder="Delhi Airport / Railway station"
              value={dayDetails?.data?.arrivalLocation || ""}
              onChange={(e) => onChange("arrivalLocation", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the transportation"
              value={dayDetails?.data?.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              placeholder="Enter price"
              value={dayDetails?.data?.price || ""}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditTransportation;
