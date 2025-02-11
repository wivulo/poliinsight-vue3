<script setup>
import { ref, watch } from 'vue';
import UserServices from '@/services/UserServices';
import { useNotification } from '@/composables/useNotification';
import { debounce } from 'lodash';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';

const emit = defineEmits(['selected']);
const { notifyError } = useNotification();

const visible = ref(false);
const users = ref([]);
const user = ref(null);
const busy = ref(false);
let search = ref('');

function show () {
    visible.value = true;
}

function hide () {
    visible.value = false;
}

function reset() {
    user.value = null;
}

function handleCancel() {
    hide();
    reset();
}

function handleOK() {
    if(user.value) {
        console.log(user.value);
        emit('selected', user.value);
        hide();
        reset();
        return
    }

    console.log(user)
    console.log('Usuário não selecionado');
    notifyError('Selecione um usuário');
}

const searchUser = debounce(async (event) => {
  try {
    busy.value = true;
    
    const params = {
      take: 10,
      skip: 1,
      where: {
        OR: [
          { name: { contains: event.query } },
          { email: { contains: event.query } }
        ]
      }
    };

    const response = await UserServices.safeSearch(params);
    users.value = response.data.data.map(user => ({
      id: user.id,
      label: `${user.name} (${user.email})`, // Exibir mais informações
      value: user
    }));
  } catch (error) {
    notifyError('Erro na busca de usuários');
  } finally {
    busy.value = false;
  }
}, 300);

function handleUserSelected(selectedUser) {
    console.log(selectedUser);
    search.value = selectedUser.value.value.name;
    user.value = selectedUser.value.value;
}

defineExpose({
    show
});
</script>

<template>
    <Dialog header="Selecione o usuário" :visible="visible" @hide="hide" modal style="width: 25rem">
        <div class="w-full h-full flex flex-col justify-center">
            <InputGroup>
                    <Button outlined class="h-9 w-9 border-0 border-surface-300 bg-transparent hover:bg-transparent">
                        <i class="fa fa-search text-surface-700" />
                    </Button>
                    <AutoComplete
                        v-model="search" 
                        @complete="searchUser" :suggestions="users" optionLabel="name" placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-0" id="autocomplete-user-viewer"
                        @item-select="handleUserSelected"
                    >
                    <template #option="slotProps">
                        <div class="flex flex-col">
                            <div class="font-bold">{{ slotProps.option.value.name }}</div>
                            <small class="text-gray-500">{{ slotProps.option.value.email }}</small>
                        </div>
                    </template>
                    </AutoComplete>
                </InputGroup> 
        </div>
    
        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
        </template>
    </Dialog>
</template>