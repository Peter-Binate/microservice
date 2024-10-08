export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly role: boolean;
}

export class UpdateUserDto {
  readonly email?: string;
  readonly password?: string;
  readonly role?: boolean;
}
