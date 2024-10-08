import { User, IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";

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

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "48h",
    });

    return token;
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser> {
    const { email, password, role } = dto;
    try {
      const user = await User.findOne({ id });
      if (!user) throw new Error(`No user found with the id: ${id}`);

      const updatedUser = await User.findOneAndUpdate({ id }, dto);
      return updatedUser;
    } catch (error) {
      throw new Error(`Cannot Update the user with the id: ${id}`);
    }
  }

  async delete(id: string): Promise<IUser> {
    try {
      const user = await User.findOne({ id });
      if (!user) throw new Error(`No user found with the id: ${id}`);

      const deletedUser = await User.findOneAndDelete({ id });
      return deletedUser;
    } catch (error) {
      throw new Error(`Cannot delete the user with the id: ${id}`);
    }
  }
}
