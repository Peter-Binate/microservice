import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", async (req, res) => {
  const dto: CreateUserDto = req.body;

  try {
    const newUser = await userController.register(dto);
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const dto: LoginDto = req.body;

  try {
    const token = await userController.login(dto);
    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const dto: UpdateUserDto = req.body;

  try {
    const updatedUser = await userController.updateUser(id, dto);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await userController.deleteUser(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await userController.findAll();
    return res.status(200).send(users);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userController.findById(id);
    return res.status(200).send(user);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
});

export default router;
