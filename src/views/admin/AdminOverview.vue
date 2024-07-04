<script>
import { mapGetters } from "vuex";
import Card from 'primevue/card';

export default {
    name: "Admin.Overview",
    components: {
        Card
    },
    computed: {
        ...mapGetters({
            users: 'admin/users',
            events: 'admin/events',
            totalUsers: 'admin/totalUsers',
            totalEvents: 'admin/totalEvents'
        }),
        totalNormalUser(){
            return this.users.filter(user => user.groupId === 2).length
        },
        totalOrganizers(){
            return this.users.filter(user => user.groupId === 3).length
        }
    }
}
</script>

<template>
    <div class="flex flex-col py-3 px-3 gap-3">
        <div class="my-3">
            <p class="text-lg text-surface-400 font-semibold ">Overview</p>
        </div>

        <div class="flex gap-7">
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Eventos</p>
                    <p>{{ totalEvents }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de eventos</a>
                </template>
            </Card>

            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Organizadores de evento</p>
                    <p>{{ totalOrganizers }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de usuários</a>
                </template>
            </Card>
    
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Usuários</p>
                    <p>{{ totalNormalUser }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de usuários</a>
                </template>
            </Card>
    
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Visitantes</p>
                    <p>{{ totalEvents }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de visitantes</a>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.card{
    width: clamp(13rem, 18vw, 25rem);
}

.card-title{
    font-size: clamp(1rem, 1.25vw, 2rem);
}

.card-text{
    font-size: clamp(0.75rem, 1vw, 1.10rem);
}
</style>