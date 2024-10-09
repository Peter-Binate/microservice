import { User, IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";
import { log } from "console";

export class UserService {
  async register(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, password, role } = createUserDto;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(`Email: ${email} already taken`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role !== undefined ? role : true,
    });

    await newUser.save();

    return newUser;
  }

  async login(credentials: LoginDto): Promise<string> {
    const { email, password } = credentials;
    const existingUser = await User.findOne({ email });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new Error("Incorrect email or password");
    }

    const payload = { id: existingUser._id, email: existingUser.email };

    const token = jwt.sign(payload, process.env.JWT_KEY as string, {
      expiresIn: "48h",
    });

    return token;
  }

  async findAll(): Promise<IUser[]> {
    const users = await User.find();
    if (!users.length) throw new Error("No users found");

    return users;
  }

  async findOne(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new Error(`No user found with the id: ${id}`);

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(id, dto, { new: true });
    if (!updatedUser) throw new Error(`No user found with the id: ${id}`);

    return updatedUser;
  }

  async delete(id: string): Promise<IUser> {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw new Error(`No user found with the id: ${id}`);

    return deletedUser;
  }
}
