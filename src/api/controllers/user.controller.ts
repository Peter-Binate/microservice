import { UserService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto, LoginDto } from "../dtos/user.dto";

export class UserController {
  constructor(private userService: UserService) {}

  register(CreateUserDto) {
    this.userService.register(CreateUserDto);
  }

  login(LoginDto) {
    this.userService.login(LoginDto);
  }
}
