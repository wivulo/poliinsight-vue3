<script>
import Card from 'primevue/card';
export default {
  name: 'InternalServerError',
    components: {
        Card,
    },
}
</script>

<template>
    <Card class="w-1/2 h-1/2">
      <template #content>
        <h1 class="text-4xl font-bold text-red-500">500</h1>
        <p class="text-lg text-gray-500">Erro Interno do servidor</p>
        <p>Por favor, realiza as seguintes instruções ou entre em contacto com a Área Técnica</p>
        <p>1. Recarregue a pagina;</p>
        <p>2. Tente fazer o login novamente</p>
        <p>3. Entre em contacto com o administrador;</p>
        </template>
    </Card>
</template>