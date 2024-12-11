import React from "react";
import "./AddTransportation.css";


function AddTransportation({ data, onChange }) {
  return (
    <div className="add-transportation-container">
      <h3 className="section-title">Add Transportation</h3>
      <form>
        <div className="transportation-form-grid">

          <div>
            <label>Transportation Type</label>
            <input
              type="text"
              placeholder="Flight, Bus, Train"
              value={data.transportation_type || ""}
              onChange={(e) => onChange("transportation_type", e.target.value)}
            />
          </div>
          <div>
            <label>Transportation Company</label>
            <input
              type="text"
              placeholder="Indigo, Air-Asia"
              value={data.company || ""}
              onChange={(e) => onChange("company", e.target.value)}
            />
          </div>
          <div>
            <label>Departure Date & Time</label>
            <input
              type="datetime-local"
              value={data.departureDateTime || ""}
              onChange={(e) => onChange("departureDateTime", e.target.value)}
            />
          </div>
          <div>
            <label>Arrival Date & Time</label>
            <input
              type="datetime-local"
              value={data.arrivalDateTime || ""}
              onChange={(e) => onChange("arrivalDateTime", e.target.value)}
            />
          </div>
          <div>
            <label>Departure Location</label>
            <input
              type="text"
              placeholder="Ahmedabad Airport / Railway station"
              value={data.departureLocation || ""}
              onChange={(e) => onChange("departureLocation", e.target.value)}
            />
          </div>
          <div>
            <label>Arrival Location</label>
            <input
              type="text"
              placeholder="Delhi Airport / Railway station"
              value={data.arrivalLocation || ""}
              onChange={(e) => onChange("arrivalLocation", e.target.value)}
            />
          </div>
          <div className="full-width">
            <label>Description</label>
            <textarea
              placeholder="Additional details about the transportation"
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              placeholder="Enter price"
              value={data.price || ""}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddTransportation;
