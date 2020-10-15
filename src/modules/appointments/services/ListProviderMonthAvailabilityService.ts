import { injectable, inject } from 'tsyringe';
import {
  getDaysInMonth,
  getDate,
  endOfDay,
  isAfter,
  isSameDay,
  getHours,
} from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map(day => {
      const compareDate = endOfDay(new Date(year, month - 1, day));

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      // if (isSameDay(compareDate, currentDate)) {
      //   return {
      //     day,
      //     available:
      //       getHours(currentDate) < 17 && appointmentsInDay.length < 10,
      //   };
      // }

      return {
        day,
        available:
          isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
