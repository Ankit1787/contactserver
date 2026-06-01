import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface User extends Document{
    name:string;
    email:string;
    password:string;
    phoneNumber:string;
    address:string,
    comparePassword(password:string):Promise<boolean>;

}

const userSchema=new Schema<User>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
    },
    address:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        select:false
    }

},{
    timestamps: true,
    versionKey: false,
})
userSchema.methods.comparePassword =async function (password:string) {
    return  bcrypt.compare(password, this.password);
}
userSchema.pre("save", async function () {
  const user = this as User;
  if (!user.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(
    this.password,

    10,
  );

  this.password = hashedPassword;

  return;

  // user.password = await bcrypt.hash(user.password, 10);
});
const userModel = model<User>("user",userSchema);
export default userModel;