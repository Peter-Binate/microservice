import { UserService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";

export class UserController {
  constructor(private userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }

  async login(dto: LoginDto) {
    return await this.userService.login(dto);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return await this.userService.update(id, dto);
  }

  async deleteUser(id: string) {
    return await this.userService.delete(id);
  }

  async findAll() {
    return await this.userService.findAll();
  }

  async findById(id: string) {
    return await this.userService.findOne(id);
  }
}
