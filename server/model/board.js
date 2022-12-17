import mongoose from 'mongoose'

const boardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
        default: '📃'
    },
    title: {
        type: String,
        default: 'Untitled'
    },
    description: {
        type: String,
        default: `Add description here 
        🟢 You can add multiple description
        🟢 Let's start...`
    },
    position: {
        type: Number
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    favoritePosition: {
        type: Number,
        default: 0
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

const Board = mongoose.model('Board', boardSchema)

export default Board