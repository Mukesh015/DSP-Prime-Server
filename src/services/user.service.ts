import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User.entity";

export class UserService {

    private userRepository = AppDataSource.getRepository(User);

    // Get All Users
    async getAllUsers() {
        return await this.userRepository.find({
            order: { id: "ASC" }
        });
    }

    // Create User
    async createUser(data: Partial<User>) {

        const user = this.userRepository.create(data);

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