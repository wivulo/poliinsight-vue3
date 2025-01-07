<script lang="ts" setup>
const props = defineProps(['setting']);
const emit = defineEmits(['update:setting']);
const option = props.setting.value;

const updateSetting = (value: string) => {
    const settingUpdated = { ...props.setting, value };
    emit('update:setting', settingUpdated);
}
</script>

<template>
    <div class="blocks-theme flex justify-center gap-3 text-sm h-20 items-center">
        <div class="block-theme flex flex-col gpa-3 cursor-pointer scale" @click="updateSetting('sistemPreference')">
            <div class="w-[170px] h-14 rounded-md overflow-hidden flex">
                <div class="bg-black w-[85px] h-14 shadow-sm shadow-black"></div>
                <div class="bg-zinc-200 w-[85px] h-14 shadow-sm shadow-zinc-100"></div>
            </div>
            <p clss="text-xs" :class="{'text-primary': option === 'sistemPreference'}">
                Preferência do sistema
            </p>
        </div>

        <div class="block-theme flex flex-col gpa-3 cursor-pointer scale" @click="updateSetting('light')">
            <div class="w-[170px] h-14 bg-zinc-100 rounded-md shadow-sm shadow-black"></div>
            <p clss="text-xs" :class="{'text-primary': option === 'light'}">
                Claro
            </p>
        </div>

        <div class="block-theme flex flex-col gpa-3 cursor-pointer scale" @click="updateSetting('dark')">
            <div class="w-[170px] h-14 bg-black rounded-md shadow-sm shadow-black"></div>
            <p clss="text-xs" :class="{'text-primary': option === 'dark'}">
                Escuro
            </p>
        </div>
    </div>
</template>

<style scoped>
.scale:hover{
    transition: all 0.3s ease;
    transform: scale(1.10);
    margin: 0 10px;
}

.scale{
    transition: all 0.3s ease;
}
</style>