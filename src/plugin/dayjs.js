//dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/pt'; // Importa o português
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';
import minMax from 'dayjs/plugin/minMax';

dayjs.locale('pt');
dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.extend(minMax);

dayjs.tz.setDefault('Africa/Luanda');

export const extendedDayjs = dayjs