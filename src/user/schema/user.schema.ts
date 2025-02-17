import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: Date;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['FAMILLE', 'RECHERCHE', 'ADMIN'], default: 'FAMILLE' })
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
