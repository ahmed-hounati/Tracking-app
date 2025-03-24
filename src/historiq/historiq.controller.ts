import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { HistoriqService } from './historiq.service';
import { Request } from 'express';
import { CreateHistoriqDto } from './dto/create-historiq.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('historiq')
export class HistoriqController {
  constructor(
    private readonly historiqService: HistoriqService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async saveSearch(
    @Headers('authorization') authHeader: string,
    @Body() createHistoriqDto: CreateHistoriqDto,
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
      }

      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.verify(token);
      return this.historiqService.saveSearch(decoded.id, createHistoriqDto);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error('Unauthorized');
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserHistory(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
      }

      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.verify(token);
      return this.historiqService.getUserHistory(decoded.id);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error('Unauthorized');
    }
  }
}
