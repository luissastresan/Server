import { gql } from 'apollo-server-express'
import { Movie } from '../models/Movie'
import { Comment } from '../models/Comment'
import { Rating } from '../models/Rating'

const typeDefs = gql`
  type Query {
    movies: [Movie!]!
    getMovie(id: String!): Movie!
    comments: [Comment!]!
    ratings: [Rating!]!
  }
  type Movie {
    _id: ID!
    title: String!
    productionYear: Int!
    director: String!
    image: String!
    comments: [Comment!]
    ratings: [Rating!]
  }
  type Comment {
    id: ID!
    comment: String!
    movie: Movie!
  }
  type Rating {
    id: ID!
    rating: Int!
    movie: Movie!
  }
  type Mutation {
    createMovie(title: String! productionYear: Int! director: String! image: String!): Movie!
    createComment(comment: String! movie: String!): Comment!
    createRating(rating: Int! movie: String!): Rating!
  }
`

const comments = async commentIds => {
    try {
        const comments = await Comment.find({ _id: { $in: commentIds } })
        return comments.map(comment => ({
            ...comment._doc,
            movie: movie.bind(this, comment._doc.movie)
        }))
    } catch {
        throw err
    }
}

const ratings = async ratingIds => {
    try {
        const ratings = await Rating.find({ _id: { $in: ratingIds } })
        return ratings.map(rating => ({
            ...rating._doc,
            movie: movie.bind(this, rating._doc.movie)
        }))
    } catch {
        throw err
    }
}

const movie = async movieId => {
    console.log("movieId:" + movieId)
    try {
        const movie = await Movie.findById(movieId)
        return {
            ...movie._doc,
            comments: comments.bind(this, movie._doc.comments),
            ratings: ratings.bind(this, movie._doc.ratings)
        }
    } catch (err) {
        throw err
    }
}

const resolvers = {
    Query: {
        movies: async () => {
            try {
                const movies = await Movie.find()
                return movies.map(movie => ({
                    ...movie._doc,
                    comments: comments.bind(this, movie._doc.comments),
                    ratings: ratings.bind(this, movie._doc.ratings)
                }))
            } catch (err) {
                throw err
            }
        },
        getMovie: async (root, args) => {
            let id = args.id
            try {
                const movies = await Movie.find()
                return movies.filter(movie => {
                    return movie.id === id
                })[0]
            } catch (err) {
                throw err
            }
        },
        comments: async () => {
            try {
                const comments = await Comment.find()
                return comments.map(comment => ({
                    ...comment._doc,
                    movie: movie.bind(this, comment._doc.movie)
                }))
            } catch (err) {
                throw err
            }
        },
        ratings: async () => {
            try {
                const ratings = await Rating.find()
                return ratings.map(rating => ({
                    ...rating._doc,
                    movie: movie.bind(this, rating._doc.movie)
                }))
            } catch (err) {
                throw err
            }
        }
    },
    Mutation: {
        createMovie: async (_, { title, productionYear, director, image }) => {
            try {
                const movie = new Movie({ title, productionYear, director, image })
                await movie.save()
                return movie;
            } catch (err) {
                throw err
            }
        },
        createComment: async (_, { comment, movie: movieId }) => {
            console.log(movie.toString())
            const newComment = new Comment({ comment, movie: movieId })
            try {
                const savedComment = await newComment.save()
                const movieRecord = await Movie.findById(movieId)
                movieRecord.comments.push(newComment)
                await movieRecord.save()
                return {
                    ...savedComment._doc,
                    movie: movie.bind(this, movieId)
                }
            } catch (err) {
                throw err
            }
        },
        createRating: async (_, { rating, movie: movieId }) => {
            console.log(movie.toString())
            const newRating = new Rating({ rating, movie: movieId })
            try {
                const savedRating = await newRating.save()
                const movieRecord = await Movie.findById(movieId)
                movieRecord.ratings.push(newRating)
                await movieRecord.save()
                return {
                    ...savedRating._doc,
                    movie: movie.bind(this, movieId)
                }
            } catch (err) {
                throw err
            }
        }

    }
}

export {
    typeDefs,
    resolvers
}