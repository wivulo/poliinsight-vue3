<script>
export default {
    name: 'Counter',
    data(){
        return {
            counter: {
                days: 10,
                hours: 24,
                minutes: 30,
                seconds: 52
            }
        }
    },
    mounted(){
        setInterval(() => {
            this.updateCounter();
        }, 1000);
    },
    methods: {
        updateCounter(){
            if(this.counter.seconds > 0){
                this.counter.seconds--;
            }else{
                this.counter.seconds = 59;
                if(this.counter.minutes > 0){
                    this.counter.minutes--;
                }else{
                    this.counter.minutes = 59;
                    if(this.counter.hours > 0){
                        this.counter.hours--;
                    }else{
                        this.counter.hours = 23;
                        if(this.counter.days > 0){
                            this.counter.days--;
                        }
                    }
                }
            }
        }
    }
}
</script>

<template>
    <div class="counter">
        <div class="counter-item">
          <p class="counter-item-text1">{{ counter.days }}</p>
          <p class="counter-item-text2"><small>DAYS</small></p>
        </div>

        <div class="counter-item">
          <p class="counter-item-text1">{{ counter.hours }}</p>
          <p><small>HOURS</small></p>
        </div>

        <div class="counter-item">
          <p class="counter-item-text1">{{ counter.minutes }}</p>
          <p><small>MINUTES</small></p>
        </div>

        <div class="counter-item">
          <p class="counter-item-text1">{{ counter.seconds }}</p>
          <p><small>SECONDS</small></p>
        </div>
    </div>
</template>

<style scoped>
.counter{
  @apply mt-3 flex gap-5 ;
}

.counter-item{
  @apply w-1/4 flex flex-col gap-3;
}

.counter-item .counter-item-text1{
  @apply text-4xl text-primary font-medium;
}
</style>