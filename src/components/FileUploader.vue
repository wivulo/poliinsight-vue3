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
<div class="flex items-center w-full">
    <label v-if="!file" for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" @dragover.prevent @drop="onDrop">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Clica para carregar uma foto </span> ou arrasta e larga</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" class="hidden" @change="handleOnChange" />
    </label>

    <div  v-else class="flex border-2 border-gray-300 border-dashed rounded-lg h-full w-full items-center relative">
        <div class="flex gap-2 w-full px-3 items-center">
            <div class="w-32 h-28">
                <img :alt="file.name" :src="file.objectURL" class="object-fill object-center h-28" />
            </div>
    
            <div class="flex flex-col gap-2 flex-grow">
                <p>
                    <span class="font-semibold">{{ file.name }}</span><br />
                    <span>{{ formatBytes(file.size) }}</span>
                </p>
                <Badge value="Pedding" class="px-2 inline-block w-32" severity="warning" />
            </div>
    
            <Button icon="fa fa-times" rounded  severity="danger" text class="absolute right-1 w-14 h-14"
                @click="handleRemove"/>
        </div>
    </div>

    <p v-if="error" class="text-red-500">{{ error }}</p>
</div> 
</template>