const mongoose=require('mongoose')

const productSchema= mongoose.Schema (
   {
    title:{type:String,required:true},
     description: { type: String, required: true },
     price: { type: Number, required: true },
     category: { type: String, required: true },
     stock: { type: Number, default: 0 },
     images: [{ type: String }],
   },
   {timestamps:true}
)

module.exports= mongoose.model('Product',productSchema)