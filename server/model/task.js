import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    position: {
        type: Number
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

const Task = mongoose.model("Task", taskSchema)

export default Task