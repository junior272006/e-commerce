const mongoose=require('mongoose')

const adminSchema=mongoose.Schema(
    {
        firstname:{type:String,required:true},
        lastname:{type:String,required:true},
        email:{type:String,required:true},
        phone:{type:Number,required:true},
        password:{type:String,required:true,unique:true},
        confirmPassword:{type:String,required:true,unique:true},
        shopName:{type:String,required:true},
        siret:{type:String,required:true},
        address:{type:String,required:true}
    }
)

module.exports=mongoose.model('Admin',adminSchema)