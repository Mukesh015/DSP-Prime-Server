import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User.entity";
import bcrypt from "bcrypt";

export class UserService {

    private userRepository = AppDataSource.getRepository(User);

    // Get All Users
    async getAllUsers() {
        return await this.userRepository.find({
            order: {
                id: "ASC"
            }
        });
    }

    // Create User
    async createUser(data: Partial<User>) {

        const { email, password } = data;

        // Check if email already exists
        const existingUser = await this.userRepository.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            ...data,
            password: hashedPassword
        });

        return await this.userRepository.save(user);
    }

    // Update User
    async updateUser(id: number, data: Partial<User>) {

        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Check email uniqueness if updating email
        if (data.email && data.email !== user.email) {

            const existingUser = await this.userRepository.findOne({
                where: { email: data.email }
            });

            if (existingUser) {
                throw new Error("Email already in use");
            }
        }

        // Hash password if updating password
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        Object.assign(user, data);

        return await this.userRepository.save(user);
    }

    // Delete User
    async deleteUser(id: number) {

        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new Error("User not found");
        }

        await this.userRepository.delete(id);

        return { message: "User deleted successfully" };
    }

}