import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HotelService } from './hotel.service';
import { Hotel } from './hotel.entity';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  findAll(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Hotel> {
    return this.hotelService.findOne(+id);
  }

  @Post()
  create(@Body() hotelData: Partial<Hotel>): Promise<Hotel> {
    return this.hotelService.create(hotelData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() hotelData: Partial<Hotel>,
  ): Promise<Hotel> {
    return this.hotelService.update(+id, hotelData);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const hotels = [];
    const stream = fs.createReadStream(file.path);
    stream
      .pipe(csvParser())
      .on('data', (row) => hotels.push(row))
      .on('end', async () => {
        await this.hotelService.batchImport(hotels);
        fs.unlinkSync(file.path); // Delete the temporary file
      });
  }
}
