<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps(['setting']);

const fomatosDeData = [
    {
        name: 'Dia Mês Ano',
        value: 'D MMM YYYY'
    },
    {
        name: 'Dia/Mês/Ano',
        value: 'DD/MM/YYYY'
    },
    {
        name: 'Mês/Dia/Ano',
        value: 'MM/DD/YYYY'
    },
    {
        name: 'Ano/Mês/Dia',
        value: 'YYYY/MM/DD'
    }
];

let formato = fomatosDeData.find((f) => f.value === props.setting.value) || fomatosDeData[0];

const changeFormat = (format: {name: string, value: string}) => {
    formato = format;
    props.setting.value = format.value;
}


</script>

<template>
    <div class="w-2/3 h-20 flex items-center">
        <Multiselect 
            v-model="formato" 
            track-by="value" 
            label="name"
            placeholder="Selecione um formato" 
            :options="fomatosDeData" 
            :searchable="false" 
            :allow-empty="false"
            openDirection="bottom"
            selectLabel="Selecionar"
            deselectLabel="Remover"
            selectedLabel="Selecionado"
        >
            <template #option="{ option }">
                <div class="flex text-slate-800 text-xs">
                    <span>{{ option.name }}</span>
                </div>
            </template>

            <template #noResult>
                <span>Oops! Nenhum item encontrado.</span>
            </template>
        </Multiselect>
    </div>
</template>