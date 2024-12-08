<script>
export default {
    name: "Dashboard.overview.event-status",
    props: ['status']    
}
</script>

<template lang="">
    <template v-if="status?.name === 'happened' ">
        <div class="text-slate-500">
            Encerrado
        </div>
    </template>
    <template v-else-if="status?.name === 'upcoming' ">
        <div class="text-yellow-500">
            Brevemente
        </div>
    </template>
    <template v-else-if="status?.name === 'happening' ">
        <div class="text-green-500">
            Aberto
        </div>
    </template>
    <template v-if="status?.name === 'cancelled' ">
        <div class="text-slate-500">
            Cancelado
        </div>
    </template>
</template>
