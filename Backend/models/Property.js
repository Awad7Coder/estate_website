const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    currentOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title :{
        type: String,
        required:true,
        minlength:8,
        trim: true,
    },
    type:{
        type:String,
        enum:["beach","mountain","village"],
        required:true
    },
    desc:{
        type:String,
        required: true,
        minlength:20
    },
    img:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sqmeters:{
        type:Number,
        required:true
    },
    continent:{
        type:String,
        required:true
    },
    beds:{
        type:Number,
        required:true,
        min:2,
    },
    featured:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Property = mongoose.model("Property",PropertySchema)

module.exports = Property