import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Rating = mongoose.model('Rating', {
    rating: Number,
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }
})