import mongoose from 'mongoose'
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// }

// userSchema.pre('save', async function(next) {
//     if(!this.isModified('password')) {
//         next()
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })

// userSchema.methods.generateJWT = function() {
//     const today = new Date();
//     const expirationDate = new Date(today);
//     expirationDate.setDate(today.getDate() + 60);

//     let payload = {
//         id: this._id,
//         email: this.email,
//         username: this.username,
//     };

//     return jwt.sign(payload, process.env.JWT_SECRET, {
//         // expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
//         expiresIn: '8h'
//     })
// }

const User = mongoose.model("User", userSchema)

export default User