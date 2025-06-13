import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser {
    email: string;
    password: string;
}

// user document interface
interface UserDoc extends mongoose.Document<IUser> {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: IUser): UserDoc;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Add id field
                delete ret._id; // Remove _id field
                delete ret.__v; // Remove __v field
                delete ret.password; // Remove password field for security
            }
        }
    }
)

userSchema.pre<UserDoc>('save', async function (next) {
    // If the password is modified, hash it before saving
    if (this.isModified('password')) {
        const salt = await bcryptjs.genSalt(10); // Generate a salt with 10 rounds
        // Hash the password with the salt
        const hash = await bcryptjs.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

// userSchema.index({ email: 1 }, { unique: true });

userSchema.statics.build = (attrs: IUser) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
export { IUser, UserDoc, UserModel }; // Export interfaces for use in other parts of the application