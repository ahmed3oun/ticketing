import ErrorHandler from "../utils/errors/error-handler";
import User, { IUser, UserDoc } from "../models/user.model";

export default class UserService {
    // Add methods for user service here
    // For example, createUser, getUserById, updateUser, deleteUser, etc.

    constructor() { }
    /**
     * Creates a new user in the database.
     * @param userData - The data for the new user.
     * @returns The created user document.
     */
    async createUser(userData: IUser): Promise<UserDoc> {
        // Logic to create a user
        const user = User.build(userData);
        await user.save();
        return user;
    }

    async getUserById(userId: string) {
        // Logic to get a user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new ErrorHandler(`User with ID ${userId} not found`, 404);
        }
        return user;
    }

    async getUserByEmail(email: string) {
        // Logic to get a user by ID
        const user = await User.findOne({ email });

        return user;
    }

    async updateUser(userId: string, userData: IUser) {
        // Logic to update a user
        const user = await User.findByIdAndUpdate(userId, userData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated data against the schema
            context: 'query', // Ensure that the validation context is set correctly
        });
        if (!user) {
            throw new ErrorHandler(`User with ID ${userId} not found`, 404);
        }
        return user;
    }
}