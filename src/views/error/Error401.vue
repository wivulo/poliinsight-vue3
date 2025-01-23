<script>
export default {
    name: 'Error401'
}
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen w-screen">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-800">401</h1>
            <h2 class="text-3xl font-semibold text-gray-800">Não autorizado</h2>
            <p class="text-gray-600">Não tens autorização para acessar essa página.</p>
            <router-link to="/" class="text-blue-500 hover:underline">Voltar para página inicial</router-link>
        </div>
    </div>
</template>