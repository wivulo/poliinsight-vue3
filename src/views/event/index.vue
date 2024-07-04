<script>
import Button from 'primevue/button'
import Counter from './components/Counter.vue'
import Navbar from './components/Navbar.vue'
import RegistrationForm from './components/Registration.vue'
import AppLogo from '@/components/AppLogo.vue'
import PlaneAroundTheWorld from './components/icons/PlaneAroundTheWorld.vue'
import Venue from './components/icons/Venue.vue'
import Restaurant from './components/icons/Restaurant.vue'
import Hotel from './components/icons/Hotel.vue'
import { useElementVisibility } from '@vueuse/core'
import EventSchedulesTab from './components/EventSchedulesTab.vue'
import EventSpeakersList from './components/EventSpeakersList.vue'
import TicketPricingBasePlane from './components/TicketPricingBasePlane.vue'
import TicketPricingPlatiniumPlane from './components/TicketPricingPlatiniumPlane.vue'
import TicketPricingGoldPlane from './components/TicketPricingGoldPlane.vue'

export default {
  name: 'Event',
  components: {
    AppLogo,
    Button, Counter, Navbar, 
    RegistrationForm, EventSchedulesTab, EventSpeakersList,
    TicketPricingBasePlane, TicketPricingPlatiniumPlane, TicketPricingGoldPlane,
    
    //icons
    PlaneAroundTheWorld, Venue, Restaurant, Hotel
  },
  data(){
    return {
      NavbarIsVisible: false,
      HotelIcon: Hotel,
      RestaurantIcon: Restaurant,
      VenueIcon: Venue,
    }
  },
  mounted() {
    this.NavbarIsVisible = useElementVisibility(this.$refs.navbar)
  },
}
</script>

<template>
  <main class="w-full">
    
    <div class="h-24 w-full flex justify-center items-center bg-white fixed z-50 -mt-24 transition-all duration-300 delay-100 shadow-md"
      :class="{'mt-0': !NavbarIsVisible}">
      <div class="w-4/5 flex justify-between items-center">
        <AppLogo />

        <Navbar />
      </div>
    </div>

    <div class="wrapper section" id="home">
      <div class="w-4/5 h-full flex flex-col gap-24">

        <div ref="navbar" class="h-24 w-full flex justify-between items-center">
          <AppLogo />

          <Navbar />
        </div>

        <div class="flex gap-5 flex-grow text-surface-700 justify-between">
          <div class="pt-5">
            <p class="text-3xl font-extralight">Leader conference</p>
            <p class="text-6xl font-bold uppercase mb-3">
              Conference<br /> 2019
            </p>
            <p class="text-2xl font-extralight my-10">
              <i class="fa fa-calendar-alt"></i> 
              20-23 November 2019 - Los Angeles CA
            </p>
            
            <Counter />
          </div>

          <div>
            <RegistrationForm />
          </div>

        </div>

      </div>
    </div>

    <div class="section bg-primary" id="location">
      <div class="w-4/5 py-28 flex justify-center items-center">
        <div class="flex gap-10 justify-center">
          <div class="location-block-container">
            <div class="icon-container">
              <Venue class="h-20  w-20 font-semibold  -ml-4" />
            </div>
            <div class="text">
              <p>Venue</p>
              <p>203 Fake St. Mountain View, 
                San Francisco, California, USA
              </p>
            </div>
          </div>

          <div class="location-block-container">
            <div class="icon-container">
              <PlaneAroundTheWorld class="h-32  w-32 font-semibold -mt-10"/>
            </div>
            <div class="text">
              <p>Transport</p>
              <p>A small river named Duden flows by their 
                place and supplies.
              </p>
            </div>
          </div>

          <div class="location-block-container">
            <div class="icon-container">
              <Hotel class="h-20  w-20 font-semibold " />
            </div>
            <div class="text">
              <p>Hotel</p>
              <p>
                A small river named Duden flows by their 
                place and supplies.
              </p>
            </div>
          </div>

          <div class="location-block-container">
            <div>
               <Restaurant class="h-20  w-20 font-semibold " />
            </div>
            <div class="text">
              <p>Restaurant</p>
              <p>
                A small river named Duden flows by their 
                place and supplies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section min-h-screen py-5" id="schedules">
      <div class="w-4/5 flex flex-col gap-5 items-center">

        <div class="w-full py-10">
          <p class="text-4xl text-center text-surface-600">Event Schedules</p>
        </div>

        <div class="flex gap-3 flex-grow w-full">
          <EventSchedulesTab />
        </div>
      </div>
    </div>

    <div class="section min-h-80" id="speakers">
      <div class="w-4/5 flex flex-col gap-5 items-center">

        <div class="w-full py-10">
          <p class="text-4xl text-center text-surface-600">Event Speakers</p>
        </div>

        <div class="flex gap-3 flex-grow w-full">
          <EventSpeakersList />
        </div>
      </div>
    </div>

    <div class="section min-h-screen" id="ticketPrincing">
      <div class="w-4/5 flex flex-col gap-5 items-center">
        <div class="w-full py-10">
          <p class="text-4xl text-center text-surface-600">Ticket Pricing</p>
        </div>

        <div class="flex gap-3 flex-grow w-full items-center">
          <div class="w-1/3 h-[500px] border">
            <TicketPricingBasePlane />
          </div>
          <div class="w-1/3 h-[530px] bg-primary">
            <TicketPricingGoldPlane />
          </div>
          <div class="w-1/3 h-[500px] border">
            <TicketPricingPlatiniumPlane />
          </div>
        </div>
      </div>
    </div>

    <div class="section h-44 items-center">
      <div class="w-4/5 flex justify-between items-center">
        <div>
          <p class="text-xl text-surface-600">© 2024 All rights reserved. Designed by wivulo</p>
        </div>
        <div>
          <Button label="Voltar para cima" icon="fa fa-arrow-up" iconPos="right" />
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped>
.wrapper{
  height: 850px;
  background-image: url('/src/assets/images/bg_1.webp');
  background-size: cover;
  background-position: center;
}

.section {
  @apply flex justify-center
}

.location-block-container{
  @apply h-60 w-52 flex flex-col justify-between py-2
}

.location-block-container .icon-container{
  @apply w-full flex items-center
}

.location-block-container .icon{
  @apply text-6xl text-white
}

.location-block-container .text{
  @apply text-white text-lg text-left
}

.location-block-container .text p:nth-child(1){
  @apply text-2xl mb-3
}
</style>