<script setup>
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
                <b class="mr-2">Data da incrição:</b>
                <span v-formatDate="iRegistration?.createdAt"></span>
            </li>
            <li>
                <b class="mr-2">Nome do grupo:</b>
                <span>{{ iRegistration?.team?.name }}</span>
            </li>
            <li>
                <b class="mr-2">Integrantes:</b>
                <div class="py-2">
                    <ul class="flex flex-wrap gap-5">
                        <li 
                            v-for="member in (Array.isArray(iRegistration?.team?.participants) ? iRegistration.team.participants : []).concat(Array.isArray(iRegistration?.team?.users) ? iRegistration.team.users : [])" 
                            :key="member.id" 
                            class="my-1 flex gap-3 w-[350px] h-[100px] bg-surface-100 p-3 items-center rounded-md shadow-sm shadow-surface-400"
                        >
                            <div class="flex items-center">
                                <Avatar :label="member.name[0]" shape="circle" size="large" />
                            </div>
                            <div class="flex flex-col gap-1 justify-center">
                                <p>Nome: <span class="mx-1">{{ member.name }}</span></p>
                                <p>Email: <span class="mx-1">{{ member.email }}</span></p>
                                <p>Contacto: <span class="mx-1"> {{ member.phone }}</span></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>