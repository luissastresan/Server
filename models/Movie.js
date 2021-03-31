import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Movie = mongoose.model('Movie', {
    title: String,
    productionYear: Number,
    director: String,
    image: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }]
})
