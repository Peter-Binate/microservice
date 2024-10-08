import { User, IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDto } from "../dtos/user.dto";

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

  async login(email: string, password: string): Promise<string> {
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
}
