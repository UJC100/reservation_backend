import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repo';
import { ReservationDocument } from './models/reservation.schema';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy
  ) { }
  

  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsService
      .send('create-charge', createReservationDto.charge)
      .pipe(
        map(async (res) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            invoice: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.findAll({})
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({_id});
  }

   async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.updateOneAndUpdate({_id}, {$set: updateReservationDto});
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({_id});
  }
}
