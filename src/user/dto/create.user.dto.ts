export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: Date;
  role?: string;
}
