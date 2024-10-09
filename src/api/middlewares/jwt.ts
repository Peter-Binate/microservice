import { User } from "../models/user.model";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Request, Response, NextFunction } from "express";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("Headers:", req.headers);

  let token = req.headers["authorization"] as string;

  console.log("Token:", token);

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni!" });
  }
  jwt.verify(token, process.env.JWT_KEY, (err: any, decoded: any) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.status(401).send({ message: "Non autorisé!" });
    }
    req.body.admin = decoded;
    next();
  });
};
