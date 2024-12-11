
const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    destinationTitle: { type: String, dafault: '' },
    packageName: { type: String, default: '' },
    country: { type: String, default: 'India' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },
    description: { type: String, default: '' },
    capacity: { type: Number, default: 1 },
    coverImage: { type: String, default: '' },
    departureDate: { type: String, default: '' },
    returnDate: { type: String, default: '' },
    price: { type: Number, default: 0 },
    nights: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    agent_id:{type:String ,default:''},
    dayDetails: {},

    // dayDetails: [
    //     {
    //         day: { type: String, default: '' },
    //         total: { type: Number, default: 0 },

    //         transportation: { type: Boolean, default: false },
    //         transportation_detail: {
    //             type: { type: String, default: '' },
    //             company: { type: String, default: '' },
    //             departure: { type: String, default: '' },
    //             arrival: { type: String, default: '' },
    //             departure_location: { type: String, default: '' },
    //             arrival_location: { type: String, default: '' },
    //             description: { type: String, default: '' },
    //             price: { type: Number, default: 0 },

    //         },


    //         destinations: { type: Boolean, default: false },
    //         destination_field: {
    //             country: { type: String, default: 'India' },
    //             city: { type: String, default: '' },
    //             state: { type: String, default: '' },
    //             zip_code: { type: String, default: '' },
    //             street: { type: String, default: '' },
    //             rating: { type: String, default: '' },
    //             description: { type: String, default: '' },
    //             destination_images: { type: Array, default: [] },
    //             destination_price: { type: Number, default: 0 },



    //         },

    //         accommodation: { type: Boolean, default: false },
    //         accommodation_field: {
    //             hotel: { type: String, default: '' },
    //             hotel_price: { type: Number, default: 0 },
    //             checkin: { type: String, default: '' },
    //             checkout: { type: String, default: '' },
    //             state: { type: String, default: '' },
    //             city: { type: String, default: '' },
    //             zipcode: { type: String, default: '' },
    //             rating: { type: String, default: '' },
    //             description: { type: String, default: '' },
    //             hotel_location: { type: String, default: '' },
    //             hotel_images: { type: Array, default: [] },

    //         },

    //         activities: { type: Boolean, default: false },
    //         activities_field: {
    //             title: { type: String, default: '' },
    //             type: { type: String, default: '' },
    //             places: { type: String, default: '' },
    //             duration: { type: String, default: '' },
    //             location: { type: String, default: '' },
    //             activities_images: { type: Array, default: [] },
    //             description: { type: String, default: '' },
    //         },

    //     },
    // ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },


}, { versionKey: false });

const Tours = mongoose.model('Tours', tourSchema);
module.exports = Tours;
