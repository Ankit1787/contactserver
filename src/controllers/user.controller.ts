import { Request, Response } from "express";
import userModel from "../models/user.model.js";
import { generateToken } from "../auth/auth.js";
import { AuthRequest } from "../middleware/auth.js";
import ContactModel from "../models/contact.model.js";
import { Types } from "mongoose";
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "all fields are required" });
      return;
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }
    const user = await userModel.create({
      name,
      email,
      password,
    });
    const token = generateToken(user);
    res.status(201).json({
      message: "user registered succesfully",
      token,
      user: { name, email },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "all fields are required" });
      return;
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }
    const token = generateToken(user);
    res.status(200).json({
      message: "user logged in succesfully",
      token,
      user: { name: user.name, email },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await userModel.findById(req.user?.id);
    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }
    res.status(200).json({ message: "user fetched succesfully", user });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
export const getAllContacts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await userModel.findById(req.user?.id);
    const name = req.query.name as string;
    const email = req.query.email as string;
    const phone = req.query.phone as string;
    let query: Record<string, unknown> = {};
    if (name) query["name"] = { $regex: name, $options: "i" };
    if (email) query["email"] = { $regex: email, $options: "i" };
    if (phone) query["phone"] = { $regex: phone, $options: "i" };
    query["userId"] = req.user?.id;

    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }
    const contacts = await ContactModel.find(query);
    res.status(200).json({ message: "contact fetched succesfully", contacts });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
export const createContact = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, phone, address, country } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "all fields are required" });
      return;
    }
    const existing = await ContactModel.find({
      userId: req.user?.id,
      $or: [{ email }, { phone }],
    });
    if (existing && existing.length > 0) {
      res.status(400).json({ message: "contact already exists" });
      return;
    }
    const contact = await ContactModel.create({
      userId: req.user?.id,
      name,
      email,
      phone,
      address,
      country,
    });
    res.status(200).json({ message: "contact created succesfully", contact });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
