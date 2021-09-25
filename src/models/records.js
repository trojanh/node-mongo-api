import mongoose from 'mongoose'

const recordsSchema = mongoose.Schema({
    counts: [],
    createdAt: Date, //can be indexed
    key: String,
    value: String
});

export const Records = mongoose.model('records', recordsSchema)
