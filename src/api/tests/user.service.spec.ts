import { UserService } from "../services/user.service";
import { User, IUser } from "../models/user.model";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  let userService: UserService;
  let userMock: IUser;

  beforeEach(() => {
    userService = new UserService();
    userMock = {
      _id: "1",
      email: "test@example.com",
      password: "hashedpassword",
      role: true,
      save: jest.fn(),
    } as unknown as IUser;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password123",
        role: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      const userInstance = {
        _id: "1",
        email: createUserDto.email,
        password: "hashedpassword",
        role: createUserDto.role,
        save: jest.fn().mockResolvedValue(true),
      };
      (User as jest.Mock).mockImplementation(() => userInstance);

      const result = await userService.register(createUserDto);
      expect(result).toEqual(userInstance);
      expect(User.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userInstance.save).toHaveBeenCalled();
    });

    it("should throw an error if the email is already taken", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "password123",
        role: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(userMock);

      await expect(userService.register(createUserDto)).rejects.toThrow(
        `Email: ${createUserDto.email} already taken`
      );
    });
  });

  describe("login", () => {
    it("should successfully login and return a token", async () => {
      const credentials: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const token = await userService.login(credentials);
      expect(token).toBe("token");
      expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credentials.password,
        userMock.password
      );
    });

    it("should throw an error if email or password is incorrect", async () => {
      const credentials: LoginDto = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      (User.findOne as jest.Mock).mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(credentials)).rejects.toThrow(
        "Incorrect email or password"
      );
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      (User.find as jest.Mock).mockResolvedValue([userMock]);

      const users = await userService.findAll();
      expect(users).toEqual([userMock]);
      expect(User.find).toHaveBeenCalled();
    });

    it("should throw an error if no users are found", async () => {
      (User.find as jest.Mock).mockResolvedValue([]);

      await expect(userService.findAll()).rejects.toThrow("No users found");
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      (User.findById as jest.Mock).mockResolvedValue(userMock);

      const user = await userService.findOne("1");
      expect(user).toEqual(userMock);
      expect(User.findById).toHaveBeenCalledWith("1");
    });

    it("should throw an error if no user is found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(userService.findOne("1")).rejects.toThrow(
        "No user found with the id: 1"
      );
    });
  });

  describe("update", () => {
    it("should update and return a user", async () => {
      const updateUserDto: UpdateUserDto = {
        email: "updated@example.com",
      };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...userMock,
        ...updateUserDto,
      });

      const updatedUser = await userService.update("1", updateUserDto);
      expect(updatedUser).toEqual({ ...userMock, ...updateUserDto });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("1", updateUserDto, {
        new: true,
      });
    });

    it("should throw an error if no user is found", async () => {
      const updateUserDto: UpdateUserDto = {
        email: "updated@example.com",
      };

      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(userService.update("1", updateUserDto)).rejects.toThrow(
        "No user found with the id: 1"
      );
    });
  });

  describe("delete", () => {
    it("should delete and return a user", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(userMock);

      const deletedUser = await userService.delete("1");
      expect(deletedUser).toEqual(userMock);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw an error if no user is found", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(userService.delete("1")).rejects.toThrow(
        "No user found with the id: 1"
      );
    });
  });
});
