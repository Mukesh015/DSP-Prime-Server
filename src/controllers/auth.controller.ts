import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const loginUser = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const result = await authService.loginUser(email, password);

        return res.json({
            success: true,
            data: result
        });

    } catch (error: any) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

};