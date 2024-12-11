import React, { useEffect, useRef } from "react";
import TourPlaceCard from "./TourPlaceCard";
import './TourPlaceList.css';

const tourPlaces = [
  {
    image: "../logos/image1.jpg",
    name: "Brandenburg Gate",
    rating: 5,
    reviews: 320,
    price: "₹150000",
  },
  {
    image: "../logos/image2.jpg",
    name: "Museum Island",
    rating: 4.7,
    reviews: 210,
    price: "₹150000",
  },
  {
    image: "../logos/image3.jpg",
    name: "Berlin Wall",
    rating: 4.9,
    reviews: 450,
    price: "₹150000",
  },
  {
    image: "../logos/image4.jpg",
    name: "Alexanderplatz",
    rating: 4.8,
    reviews: 390,
    price: "₹150000",
  },
  {
    image: "../logos/image5.jpg",
    name: "Charlottenburg Palace",
    rating: 4.6,
    reviews: 200,
    price: "₹150000",
  },
];

function TourPlaceList (){
  const listRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (listRef.current) {
        const firstChild = listRef.current.querySelector('.tour-place:first-child');
        listRef.current.scrollBy({
          left: firstChild.clientWidth + 20, // Scroll the width of one card plus the gap
          behavior: 'smooth',
        });

        // Move the first item to the end after it slides out of view
        setTimeout(() => {
          listRef.current.appendChild(firstChild);
          listRef.current.scrollLeft -= firstChild.clientWidth + 20; // Adjust the scroll position after moving the item
        }, 500); // Adjust delay to match your scroll speed
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tour-place-list">
      <h2>Must-Visit Places in India</h2>
      <div className="tour-places" ref={listRef}>
        {tourPlaces.map((place, index) => (
          <TourPlaceCard key={index} {...place} />
        ))}
      </div>
    </div>
  );
};

export default TourPlaceList;
