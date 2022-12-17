import mongoose from 'mongoose'

const sectionSchema = mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

const Section = mongoose.model("Section", sectionSchema)

export default Section