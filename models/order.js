const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Order = new Schema({
    OrderID: {
        type: String
    },
    OrderType: {
        type: String
    },
    OrderDate: {
        type: String
    },
    OrderProduct: {
        type: String
    },
    OrderPrice: {
        type: String
    },
    Status:{
        type: String
    }
});

module.exports = mongoose.model('order', Order);