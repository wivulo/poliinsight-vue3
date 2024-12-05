<script>
import EventService from '@/services/EventServices'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt'
import { eventsFullCalendarAdapter } from './eventsFullCalendarAdapter'
import { mapGetters } from 'vuex'

export default {
    name: "events.calendar",
    components: {
        FullCalendar
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        locale: ptLocale,
        eventSources: [
          {
            events: async (info, successCallback, failureCallback) => {
              try {
                const response = await EventService.fetchEventsOrganizer(this.user.id)
                const events = eventsFullCalendarAdapter(response.data)
                successCallback(events)
              } catch (error) {
                console.error(error)
                failureCallback(error)
              }
            }
          }
        ]
      }
    }
  },
}
</script>

<template>
    <div class="p-4 px-5 w-full">
        <FullCalendar :options="calendarOptions" >
          <template #eventContent="arg">
            <div class="text-slate-800 bg-slate-300 font-semibold text-xs p-1 rounded-sm overflow-hidden w-full">
              <p class="cursor-pointer">
                <i class="fa fa-circle text-primary-500 mr-1" /> 
                <router-link :to="{name: 'event.show', params: {id: arg.event.extendedProps.id}}">{{ arg.event.title }}</router-link>
              </p>
            </div>
          </template>
        </FullCalendar>
    </div>
</template>

<style>
div.fc-scroller.fc-scroller-liquid-absolute::-webkit-scrollbar{
 width: 0px;
}
</style>