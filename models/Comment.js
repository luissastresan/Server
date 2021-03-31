import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Comment = mongoose.model('Comment', {
    comment: String,
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }
})
