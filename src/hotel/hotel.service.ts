import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find();
  }

  findOne(id: number): Promise<Hotel> {
    return this.hotelRepository.findOne({ where: { id } });
  }

  create(hotelData: Partial<Hotel>): Promise<Hotel> {
    const hotel = this.hotelRepository.create(hotelData);
    return this.hotelRepository.save(hotel);
  }

  async update(id: number, hotelData: Partial<Hotel>): Promise<Hotel> {
    await this.hotelRepository.update(id, hotelData);
    return this.findOne(id);
  }

  async batchImport(hotels: Partial<Hotel>[]): Promise<void> {
    await this.hotelRepository.save(hotels);
  }
}
