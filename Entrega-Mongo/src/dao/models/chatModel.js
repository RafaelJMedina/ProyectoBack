import mongoose from 'mongoose';

const chatCollection = 'chat';

const chatSchema = mongoose.Schema({
    
})

const chatModel = mongoose.model(chatCollection, chatSchema);

export default chatModel;