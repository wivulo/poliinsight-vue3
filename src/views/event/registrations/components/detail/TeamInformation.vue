<script setup>
import Avatar from 'primevue/avatar';
const { iRegistration } = defineProps(['iRegistration']);
</script>

<template>
    <div class="px-3">
        <ul class="flex flex-col gap-1 text-sm">
            <li>
                <b class="mr-2">ID da inscrição:</b>
                <span>{{ iRegistration?.id }}</span>
            </li>
            <li>
                <b class="mr-2">Data da inscrição:</b>
                <span v-formatDate="iRegistration?.createdAt"></span>
            </li>
            <li>
                <b class="mr-2">Nome do grupo:</b>
                <span>{{ iRegistration?.team?.name }}</span>
            </li>
            <li>
                <b class="mr-2">Integrantes:</b>
                <div class="py-2">
                    <!-- Atualizado: lista de integrantes em grid responsivo -->
                    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <li 
                            v-for="member in (Array.isArray(iRegistration?.team?.participants) ? iRegistration.team.participants : []).concat(Array.isArray(iRegistration?.team?.users) ? iRegistration.team.users : [])" 
                            :key="member.id" 
                            class="flex gap-3 bg-surface-100 p-3 items-center rounded-md shadow-sm"
                        >
                            <div class="flex items-center">
                                <Avatar :label="member.name[0]" shape="circle" size="large" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <p>Nome: <span>{{ member.name }}</span></p>
                                <p>Email: <span>{{ member.email }}</span></p>
                                <p>Contato: <span>{{ member.phone }}</span></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>