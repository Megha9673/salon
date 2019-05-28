const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    order_id:{
        type: Number
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    subtotal: {
      type: Number
    },
    date: {
        type: String
    }
})    

module.exports = mongoose.model('Order', OrderSchema);