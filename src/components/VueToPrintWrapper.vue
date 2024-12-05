
  
<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useVueToPrint } from "vue-to-print";
  import PrinterHeader from '@/components/PrinterHeader.vue';
  
  export default defineComponent({
    name: "VueToPrintWrapper",
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    setup(_, { expose }) {
      const componentRef = ref();
      const isPrinting = ref(false); // Estado de carregamento

      const { handlePrint: print } = useVueToPrint({
        content: componentRef,
        documentTitle: "Document",
        onBeforePrint: () => {
          isPrinting.value = true; // Ativa o loader antes de imprimir
        },
        onAfterPrint: () => {
          isPrinting.value = false; // Desativa o loader após a impressão
        },
      });

      // Método para iniciar a impressão
      const handlePrint = async () => {
        try {
          await print(); // Aguarda a impressão
        } catch (error) {
          console.error("Erro ao imprimir:", error);
          isPrinting.value = false; // Garante que o loader seja desativado
        }
      };
      
  
      // Exponha o método handlePrint para o slot
      expose({
        handlePrint,
        componentRef
      });
  
      return {
        componentRef,
        handlePrint,
        isPrinting
      };
    },
    components: {
      PrinterHeader
    },
  });
  </script>

<template>
  <div>
    <div v-if="isPrinting" class="loader">
        <p>Preparando impressão...</p>
    </div>
    
    <div v-else ref="componentRef">
      <!-- Loader visível durante o processo de impressão -->
      <div class="print-only">
        <PrinterHeader :type="type" />
      </div>

      <slot :printer="{ handlePrint }"></slot>
    </div>
  </div>
</template>

<style>
/* Estilize o loader */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
.loader p {
  font-size: 18px;
  color: #333;
}
</style>
  