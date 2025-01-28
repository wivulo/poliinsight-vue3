<script setup>
import Avatar from 'primevue/avatar';

const { iRegistration } = defineProps(['iRegistration']);
</script>

<template>
    <div>
        <ul class="flex flex-col gap-1 text-sm">
                <li>
                    <b class="mr-2">ID da inscrição:</b>
                    <span>{{ iRegistration?.id }}</span>
                </li>
                <li v-if="iRegistration?.ticketId">
                    <b class="mr-2">Ticket:</b>
                    <span>{{ iRegistration?.ticket?.name }}</span>
                    <span class="mx-2" />
                    <span>{{ iRegistration?.ticket?.price }} akz</span>
                </li>
                <li>
                    <b class="mr-2">Data da incrição:</b>
                    <span v-formatDate="iRegistration?.createdAt"></span>
                </li>
                <li>
                    <b class="mr-2">Participante:</b>
                </li>
        </ul>
        <div class="px-3 my-1 flex gap-3 w-[450px] h-[100px] bg-surface-100 p-3 items-center rounded-md shadow-sm shadow-surface-400">
            <ul class="flex flex-col gap-1 text-sm">
                <li v-if="iRegistration?.participant?.id" class="my-1 flex gap-3 items-center">
                    <div class="flex items-center">
                        <Avatar :label="iRegistration?.participant?.name[0]" shape="circle" size="xlarge" />
                    </div>                    
                    
                    <div class="flex flex-col gap-1 justify-center">
                        <p>Nome: <span class="mx-1">{{ iRegistration?.participant?.name }}</span></p>
                        <p>Email: <span class="mx-1">{{ iRegistration?.participant?.email }}</span></p>
                        <p>Contacto: <span class="mx-1"> {{ iRegistration?.participant?.phone }}</span></p>
                    </div>
                </li>
                <li v-if="iRegistration?.user?.id" class="my-1 flex gap-3 items-center">
                    <div class="flex items-center">
                        <Avatar :label="iRegistration?.user?.name[0]" shape="circle" size="xlarge" />
                    </div>                    
                    
                    <div class="flex flex-col gap-1 justify-center">
                        <p>Nome: <span class="mx-1">{{ iRegistration?.user?.name }}</span></p>
                        <p>Email: <span class="mx-1">{{ iRegistration?.user?.email }}</span></p>
                        <p>Contacto: <span class="mx-1"> {{ iRegistration?.user?.phone }}</span></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>