import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'Users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    gender: String,
    email: String,
    password: String
})

userSchema.plugin(mongoosePaginate)

const usersModel = mongoose.model(collection,userSchema);

export default usersModel;