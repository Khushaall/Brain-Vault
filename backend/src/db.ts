import mongoose from "mongoose";

// mongoose.connect("mongodb://127.0.0.1:27017/brainly").then(
//    ()=>{
//     console.log("Mongo Connected")
//    }
// )


mongoose.connect("mongodb+srv://khushalsharma122:khushalsharma122@cluster0.nbr3on6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>{
     console.log("Mongo Connected")
    }
 )


const UserSchema = new mongoose.Schema({
    username:{type:String, required:true ,unique:true},
    password:{type : String,required:true},
});

const ContentSchema = new mongoose.Schema({

    title:String,
    link:String,
    tag:String,
    userId : {type: mongoose.Schema.Types.ObjectId , ref:"User", required:true}

})

const LinkSchema = new mongoose.Schema({
    hash: String,
    userId : {type: mongoose.Schema.Types.ObjectId , ref:"User", required:true}
})

export const LinkModel = mongoose.model("Links" , LinkSchema);
export const ContentModel = mongoose.model("Content",ContentSchema); 

export const UserModel = mongoose.model("User",UserSchema);

