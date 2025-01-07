<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRequest } from '@/composables/useRequest';
import { useStore } from 'vuex';
import UserServices from '@/services/UserServices';
import DepartamentService from '@/services/DepartamentService';
import { useDateFormatter } from '@/composables/useDateFormatter';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import SettingGroupItemContainer from '@/views/setting/components/SettingGroupItemContainer.vue';
import ModalChangeProfilePicture from './ModalChangeProfilePicture.vue';
import ModalUpdateUserNormalInformation from './ModalUpdateUserNormalInformation.vue';
import ModalUpdateUserPassword from './ModalUpdateUserPassword.vue';

const router = useRouter()
const store = useStore()
const { formatter } = useDateFormatter();
const { busy, executeRequest } = useRequest();

const user = ref({
    id: null,
    email: null,
    name: null,
    gender: null,
    birthday: null,
    profilePictureURL: null,
    course: null,
    institution: null,
    departmentId: null,
    username: null,
    password: null,
    group: {
        id: null,
        name: null
    },
    department: {
        id: null,
        name: null
    }
});

const fetchUser = async () => {
    user.value = await executeRequest(
        () => UserServices.show(store.getters['auth/user'].id),
        null,
        'Erro ao buscar as configurações'
    );
}
fetchUser();

const modalChangeProfilePictureRef = ref(null);
const handleUpdateProfilePicture = () => {
    modalChangeProfilePictureRef.value.show(store.getters['auth/user'].id);
}

const modalUpdateUserNormalInformationRef = ref(null);
const handleUpdateUserNormalInformation = async (field, label) => {
    modalUpdateUserNormalInformationRef.value.show(store.getters['auth/user'].id, label, field);
}

const modalUpdateUserPasswordRef = ref(null);
const handleUpdateUserPassword = async () => {
    modalUpdateUserPasswordRef.value.show(store.getters['auth/user'].id);
}
</script>

<template>
    <div class="flex flex-col gap-y-5 text-sm">
        <ModalChangeProfilePicture ref="modalChangeProfilePictureRef" @updated="fetchUser" />
        <ModalUpdateUserNormalInformation ref="modalUpdateUserNormalInformationRef" @updated="fetchUser" />
        <ModalUpdateUserPassword ref="modalUpdateUserPasswordRef" @updated="fetchUser" />

        <SettingGroupItemContainer label="Foto de perfil" showButton
            description="Adicione uma foto de perfil ou altere a foto actual"
            @setting:update="handleUpdateProfilePicture"
        >
            <div class="flex justify-center">
                <!-- <img :src="user.name" alt=""> -->
                <Avatar v-if="user.imageURL" :image="user.imageURL" shape="circle" size="xlarge" class="cursor-pointer hover:scale-110 transform transition-transform"/>
                <Avatar v-else icon="fa fa-user" shape="circle" size="large" class="cursor-pointer hover:scale-110 transform transition-transform"/>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Nome" showUpdateButton
            description="Nome completo do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('name', 'Nome')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.name }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Nome de usuário(username)" showUpdateButton
            description="Nome de usuário do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('username', 'Nome de usuário')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.username ?? '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Email" showUpdateButton
            description="Endereço de email do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('email', 'Email')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.email }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Gênero" showButton
            description="Gênero do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('gender', 'Gênero')"
        >
            <div class="flex justify-center">
                <!-- <Inputtext v-model="user.gender"  size="small" class="h-8 w-64" placeholder="Gênero" /> -->
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md">
                    {{ user.gender ? user.gender === 'male' ? 'Masculino' : 'Feminino' : '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Data de nascimento" showButton
            description="Data de nascimento do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('birthday', 'Data de nascimento')"
        >
            <div class="flex justify-center">
                <!-- <Inputtext v-model="user.birthday"  size="small" class="h-8 w-64" placeholder="Data de nascimento" /> -->
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md">
                    {{ user.birthday ? formatter(user.birthday).formatedDate : '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Curso" showButton
            description="Curso do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('course', 'Curso')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.course ?? '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Instituição" showButton
            description="Instituição do utilizador"
            @setting:update="() => handleUpdateUserNormalInformation('institution', 'Instituição')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.institution ?? '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <SettingGroupItemContainer label="Departamento" showUpdateButton
            description="Departamento que o utilizador pertence"
            @setting:update="() => handleUpdateUserNormalInformation('departmentId', 'Departamento')"
        >
            <div class="flex justify-center">
                <div class="border border-slate-300 px-3 py-1 h-8 w-64 rounded-md truncate">
                    {{ user.department?.name ?? '' }}
                </div>
            </div>
        </SettingGroupItemContainer>

        <div class="mt-3 px-2 rounded-md border border-red-600/50 py-3">
            <SettingGroupItemContainer label="Palavra Passe" showUpdateButton
                description="Alterar a palavra passe do utilizador"
                @setting:update="handleUpdateUserPassword"
            >
                <div class="flex justify-center">
                    <div class="border border-slate-300 px-3 py-2 h-8 w-64 rounded-md truncate">
                        ********
                    </div>
                </div>
            </SettingGroupItemContainer>
        </div>

    </div>
</template>