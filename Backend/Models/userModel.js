const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    fname : {
        type : String,
        required  : true,
    },
    lname : {
        type : String,
        required  : true,
    },
    email:{
        type:String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transctions' }] 
})

const user_1 = mongoose.model('userr',userSchema);


module.exports = user_1;