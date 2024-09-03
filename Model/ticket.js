const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    eventId: { type: String, required: true },
    amountPaid: {type: Number, required: true},
    date: {type: Date, default: () =>  Date.now()},
    quantity: {type: Number, required: true},
    email: {type: String, required: true}
});

const Tickets = mongoose.model('tickets', ticketSchema);

module.exports = Tickets;