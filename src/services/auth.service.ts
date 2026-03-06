import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {

    private userRepository = AppDataSource.getRepository(User);

    async loginUser(email: string, password: string) {

        const user = await this.userRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            (process.env.JWT_SECRET || "your_jwt_secret") as string,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

}