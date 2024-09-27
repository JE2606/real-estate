import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-filled-person-shape_59170&psig=AOvVaw1u6HpUG180P1H9fwLxIoY3&ust=1726790743932000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNit-frazYgDFQAAAAAdAAAAABAE"
    }
},
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
