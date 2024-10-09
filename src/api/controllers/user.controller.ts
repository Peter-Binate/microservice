import { UserService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";

export class UserController {
  constructor(private userService: UserService) {}

  register(createUserDto: CreateUserDto) {
    this.userService.register(createUserDto);
  }

  login(dto: LoginDto) {
    this.userService.login(dto);
  }

  updateUser(id: string, dto: UpdateUserDto) {
    this.userService.update(id, dto);
  }

  deleteUser(id: string) {
    this.userService.delete(id);
  }

  findAll() {
    this.userService.findAll();
  }

  findById(id: string) {
    this.userService.findOne(id);
  }
}
