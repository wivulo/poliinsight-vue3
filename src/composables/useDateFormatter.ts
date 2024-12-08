import { ref } from 'vue'
import dayjs from 'dayjs'

export function useDateFormatter() {
    const formatedDate = ref(null)
    const formattedTime = ref(null)

    function formatter(date: string, time: string | undefined) {
        formatedDate.value = dayjs(date).format('D MMMM, YYYY')

        if (time) {
            formattedTime.value = dayjs(time).format('HH:mm')
        }

        return {
            formatedDate,
            formattedTime
        }
    }

  return {
    formatter
  }
}