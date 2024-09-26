const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    name: {type: String, required: true},
    details: {type: String, required: true},
    date: {type: Date, required: true},
    category: {type: String},
    image: {type: String, required: true},
    location: {
        isOnline: {type: Boolean, required: true},
        event_location: {type: String},
         url: {type: String}},
    state: {type: String},
    time: {
        start_time: {type: String, required: true},
        end_time: {type: String, required: true}
    },
    contact: 
        {twitter: {type: String},
    instagram: {type: String},
whatsapp: {type: String}}
    ,
    capacity: {type: Number, required: true},
    creatorId: {type: String, required: true},
    price: {ticket_price: {type: Number},
Free: {type: Boolean}}, 
expireAt: {type: Date, required: true}
}, {
    timestamps: true
});
eventSchema.index({"expireAt": 1}, {expireAfterSeconds: 0});
const Event = mongoose.model('event', eventSchema);
module.exports = Event;