<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps(['setting']);
const emit = defineEmits(['update:setting']);

const langs = [
    {
        name: 'Português',
        value: 'pt'
    },
    {
        name: 'Inglês',
        value: 'en'
    },
    {
        name: 'Espanhol',
        value: 'es'
    }
];

const lang = langs.find((lang) => lang.value === props.setting.value) || langs[0];

const updateSetting = (lang: any) => {
    lang = lang
    const settingUpdated = { ...props.setting, value: lang.value };
    emit('update:setting', settingUpdated);
}

</script>

<template>
    <div class="w-2/3 h-20 flex items-center">
        <Multiselect 
            v-model="lang" 
            track-by="value" 
            label="name"
            placeholder="Selecione um idioma" 
            :options="langs" 
            :searchable="false" 
            :allow-empty="false"
            openDirection="bottom"
            selectLabel="Selecionar"
            deselectLabel="Remover"
            selectedLabel="Selecionado"
            @select="updateSetting"
        >
            <template #option="{ option }">
                <div class="flex text-slate-800 text-sm">
                    <span>{{ option.name }}</span>
                </div>
            </template>

            <template #noResult>
                <span>Oops! Nenhum item encontrado.</span>
            </template>
        </Multiselect>
    </div>
</template>