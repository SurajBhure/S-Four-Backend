const {Schema, model, Types} = require("mongoose");


const orderSchema = new Schema(
    {
        productId:{type: Types.ObjectId, ref:"Product"},
        userId:{type:Types.ObjectId,ref:"User"},
        size:{
            required:false,
            type:String
        },
        color:{
            required:false,
            type:String
        },
        quantities:{
            required:true,
            type:Number
        },
        address:{
            required:true,
            type:Map
        }
    },{
        timestamps:true
    }

  );
  
  
  const orderModel = model("order", orderSchema);
  module.exports = orderModel;
  