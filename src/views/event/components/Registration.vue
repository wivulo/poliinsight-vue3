<script>
import Button from 'primevue/button'
import Card from 'primevue/card';
export default {
    name: 'RegistrationForm',
    components: {
        Button, Card
    }
}
</script>

<template>
    <Card class="w-80 rounded-sm">

        <template #title>
            <p class="text-4xl font-normal">Join Conference</p>
        </template>
        <template #content>
            <form>
            <input type="text" placeholder="Entra com o teu Nome">
            <input type="email" placeholder="Entra com o teu Email">
            <input type="text" placeholder="Entra com o teu Numero">

            <div>
                <input type="checkbox" name="" id="" class="mr-2">
                I have read and accept the terms and conditions
            </div>

            <Button class="rounded-none">Join Now</Button>
        </form>
        </template>
    </Card>
</template>

<style scoped>
form{ @apply flex flex-col gap-7 }

input{ @apply border-b border-surface-400 py-2 rounded-none focus:border-b focus:outline-none }
</style>