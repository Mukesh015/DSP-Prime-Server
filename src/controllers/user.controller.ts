import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
    try {

        const users = await userService.getAllUsers();

        return res.json({
            success: true,
            data: users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });

    }
};


export const createUser = async (req: Request, res: Response) => {
    try {

        const { name, phone } = req.body;

        const user = await userService.createUser({
            name,
            phone
        });

        return res.status(201).json({
            success: true,
            data: user
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Failed to create user"
        });

    }
};


export const updateUser = async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);
        const { name, phone } = req.body;

        const updatedUser = await userService.updateUser(id, {
            name,
            phone
        });

        return res.json({
            success: true,
            data: updatedUser
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


export const deleteUser = async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        const result = await userService.deleteUser(id);

        return res.json({
            success: true,
            message: result.message
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};