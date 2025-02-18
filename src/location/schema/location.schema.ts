import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, type: Object })
  coordinates: { lat: number; lng: number };
}

export const LocationSchema = SchemaFactory.createForClass(Location);
