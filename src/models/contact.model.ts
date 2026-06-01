import { model, Schema, Document,Types } from "mongoose";

export interface Contact extends Document {
  userId:Types.ObjectId,
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
}

const contactSchema = new Schema<Contact>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    address:{
        type:String,
    },
    country:{
        type:String,
        require:true,
    },
})

const ContactModel = model<Contact>("contact",contactSchema);
export default ContactModel;
