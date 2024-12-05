
  
<script>
import { mapGetters, mapMutations } from "vuex";
import PrinterHeader from "@/components/PrinterHeader.vue";

export default {
  name: "GlobalPrintWrapper",
  components: {
    PrinterHeader,
  },
  computed: {
    ...mapGetters("printer", ["isPrinting"]),
  },
  mounted() {
    this.setComponentRef(this.$refs.componentRef); // Vincula a referência ao Vuex
  },
  methods: {
    ...mapMutations("printer", ["SET_COMPONENT_REF"]),
    setComponentRef(ref) {
      this.SET_COMPONENT_REF(ref);
    },
  },
};
</script>

<template>
    <div class="w-full">
      <div v-if="isPrinting" class="loader">
        <p>Preparando impressão...</p>
      </div>

      <div v-else ref="componentRef" class="w-full">
        <div class="print-only mb-3 w-full">
            <PrinterHeader type="teste disso" />
        </div>

        <slot />
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
  