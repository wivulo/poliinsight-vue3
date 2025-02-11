<script setup>
import { ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import ModalUserHaveAccount from './ModalUserHaveAccount.vue';
import { extendedDayjs } from '@/plugin/dayjs';

const props = defineProps(['index']);
const emit = defineEmits(['update:member']);

const member = ref({
    name: null,
    email: null,
    phone: null,
    birthdate: null,
    gender: null
});

const genders = ref([
    'Masculino',
    'Feminino'
]);

const reset = () => {
    member.value = {
        name: null,
        email: null,
        phone: null,
        birthdate: null,
        gender: null
    };
};

const userHaveAccount = ref(false);

const ModalUserHaveAccountRef = ref(null);
function handleShowUserHaveAccountModal() {
    ModalUserHaveAccountRef.value.show();
}

const handleUserHaveAccountSelected = (user) => {
  member.value = {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthdate: user.birthdate ? new Date(user.birthdate).toISOString() : null,
    gender: user.gender
  };
};

// Validar email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

watch(member, (newMember) => {
  if (newMember.userId || (newMember.name && isValidEmail(newMember.email) && newMember.phone)) {
    emit('update:member', newMember);
  }
}, { deep: true });

watch(userHaveAccount, (value) => {
    if (value) {
        handleShowUserHaveAccountModal();
    }
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <ModalUserHaveAccount ref="ModalUserHaveAccountRef" @selected="handleUserHaveAccountSelected" />

        <div class="form-group w-full">
            <Checkbox v-model="userHaveAccount" class="me-2" :binary="true" />
            <small class="text-surface-400">O Participante já tem uma conta?</small>
        </div>

        <div class="flex flex-wrap gap-3">
            <div class="form-group">
                <label :for="'member-'+index" class="ml-2">
                    <i class="fas fa-user me-1 "></i> <small> Nome </small> 
                </label>
                <InputText :id="'member-'+index" v-model="member.name" 
                    class="w-full border-zinc-300 h-9" :required="true" 
                    placeholder="Ex.: João da Silva" 
                />
            </div>

            <div class="form-group">
                <label :for="'member-'+index" class="ml-2">
                    <i class="fas fa-envelope me-1 "></i> <small> Email </small> 
                </label>
                <InputText :id="'member-'+index" v-model="member.email" 
                    class="w-full border-zinc-300 h-9" :required="true"
                    placeholder="Ex.: joaosilva@gmail.com"
                    :invalid="member.email && !isValidEmail(member.email)"
                />

                <small v-if="member.email && !isValidEmail(member.email)" class="text-red-500">
                    Email inválido
                </small>
            </div>

            <div class="form-group">
                <label :for="'member-'+index" class="ml-2">
                    <i class="fas fa-phone me-1 "></i> <small> Telefone </small> 
                </label>
                <InputText :id="'member-'+index" v-model="member.phone" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: (244) 999xxxxxx" />
            </div>

            <div class="form-group">
                <label :for="'member-'+index" class="ml-2">
                    <i class="fas fa-calendar me-1 "></i> <small> Data de Nascimento </small>
                </label>
                <Calendar :id="'member-'+index" v-model="member.birthdate" class="w-full border-zinc-300 hover:border-zinc-400 h-9" :required="true" placeholder="Ex.: 01/01/2000" />
            </div>

            <div class="form-group">
                <label :for="'member-'+index" class="ml-2">
                    <i class="fas fa-venus-mars me-1 "></i> <small> Gênero <span class="text-xs text-surface-300">(opcional)</span></small>
                </label>
                
                <Dropdown 
                    :id="'member-'+index" v-model="member.gender" :options="genders" 
                    class="w-full border-zinc-300 h-9" placeholder="Ex.: Masculino" 
                />
            </div>
        </div>
    </div>
</template>