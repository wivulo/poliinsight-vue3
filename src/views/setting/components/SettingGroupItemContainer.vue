<script setup>
import Button from 'primevue/button';

defineProps({
    label: String,
    description: String,
    showButton: Boolean,
    showUpdateButton: Boolean,
})

const emit = defineEmits(['setting:delete', 'setting:update'])

const handleDelete = () => {
    emit('setting:delete')
}

const handleUpdate = () => {
    emit('setting:update')
}
</script>

<template>
    <div class="grid grid-cols-4 items-center gap-3 border-b py-1">
        <div>
            <h2 class="text-sm">{{ label }}</h2>
            <p class="text-xs">{{ description }}</p>
        </div>

        <div class="col-span-2 flex justify-center">
            <slot />
        </div>

        <div class="flex gap-3 justify-end right-5 relative" v-if="showUpdateButton">
            <Button size="small" class="h-8" severity="secondary" @click="handleUpdate">
                <span class="text-slate-700"> <i class="fa fa-edit" /> Alterar</span>
            </Button>
        </div>

        <div class="flex gap-3 justify-center" v-if="showButton">
            <slot name="extra-buttons"/>

            <Button size="small" class="h-8" severity="secondary" @click="handleUpdate">
                <span class="text-slate-700"> <i class="fa fa-edit" /> Alterar</span>
            </Button>

            <Button size="small" class="h-8" severity="secondary" @click="handleDelete">
                <span class="text-primary-500"> <i class="fa fa-trash" /> deletar</span>
            </Button>
        </div>
    </div>
</template>