//dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/pt'; // Importa o português
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';
dayjs.locale('pt');
dayjs.extend(utc)
dayjs.extend(timezone);

dayjs.tz.setDefault('Africa/Luanda');

export const extendedDayjs = dayjs