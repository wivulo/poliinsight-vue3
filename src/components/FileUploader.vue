<script>
import Button from 'primevue/button';
import Badge from 'primevue/badge';

export default {
    name: 'FileInput',
    components: {
        Button,
        Badge
    },
    data(){
        return {
            file: null,
            error: null,
            MAXSIZE:  5 * 1024 * 1024, // 5MB
        }
    },
    methods: {
        prepareFile(file){
            if (file.size > this.MAXSIZE) {
                this.error = 'O arquivo é muito grande. Por favor, carregue um arquivo de no máximo 5MB.';
            } else {
                this.file = file
                this.file.objectURL = URL.createObjectURL(file)
                this.error = null

                this.$emit('uploaded', this.file)
            }
        },

        onDrop(e) {
            e.preventDefault();
            const file = e.dataTransfer.files[0];

            this.prepareFile(file)
        },

        handleOnChange(e){
            e.preventDefault();
            const file = e.target.files[0];

            this.prepareFile(file)
        },

        formatBytes(bytes) {
            if (bytes < 1024) return bytes + " Bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
        },

        handleRemove(){
            this.file = null
        },
    }
}
</script>

<template>
<div class="flex items-center w-full max-w-[439px] max-h-[326px]">
    <label v-if="!file" for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" @dragover.prevent @drop="onDrop">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Clica para carregar uma foto </span> ou arrasta e larga</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">PNG ou JPG (MIN. 1000x400px)</p>
        </div>
        <input id="dropzone-file" type="file" class="hidden" @change="handleOnChange" />
    </label>

    <div  v-else class="flex flex-col border border-zinc-300 border-solid h-full w-full relative">
        <div class="w-full flex justify-center">
            <img :alt="file.name" :src="file.objectURL" class="object-fill object-center max-h-[325px]"/>
        </div>

        <div class="w-full bg-primary-500 text-white p-2 absolute bottom-0 left-0">
            <p class="text-sm">{{ file.name }}</p>
            <p class="text-sm">{{ formatBytes(file.size) }}</p>
        </div>

        <Button 
            icon="fa fa-times" 
            rounded  severity="danger" text
            size="small"
            class="top-0 right-1 w-14 h-14"
            style="position: absolute;"
            @click="handleRemove" 
        />
    </div>

    <p v-if="error" class="text-primary-500">{{ error }}</p>
</div> 
</template>