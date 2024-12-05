import { useVueToPrint } from "vue-to-print";

const state = () => ({
  componentRef: null,
  isPrinting: false,
});

const getters = {
  isPrinting: (state) => state.isPrinting,
};

const mutations = {
  SET_COMPONENT_REF(state, ref) {
    state.componentRef = ref;
  },
  SET_PRINTING_STATE(state, isPrinting) {
    state.isPrinting = isPrinting;
  },
};

const actions = {
  async handlePrint({ state, commit }) {
    if (!state.componentRef) {
      console.error("Referência do componente não está definida.");
      return;
    }

    const { handlePrint } = useVueToPrint({
      content: () => state.componentRef,
      documentTitle: "Document",
      onBeforePrint: () => commit("SET_PRINTING_STATE", true),
      onAfterPrint: () => commit("SET_PRINTING_STATE", false),
    });

    try {
      await handlePrint();
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      commit("SET_PRINTING_STATE", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
