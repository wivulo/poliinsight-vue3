<script>
import FinancesServices from '@/services/FinancesServices.js';
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

export default {
    name: "ModalNewInvestiment",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown
    },
    data(){
        return {
            visible: false,
            busy: false,
            investment: {
                name: '',
                amount: 0
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods : {
        async show(){
            this.visible = true;
        },

        async handleStore(){
            try {
                if(!this.verifyRequiredFields()) {
                    this.handleErrorMessage('Preencha todos os campos obrigatórios');
                    return;
                };

                const result = await this.$swal.fire({
                    title: '',
                    text: 'Tem a certeza?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, Tenho',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: 'rgb(218, 85, 81)',
                    cancelButtonColor: 'rgba(150, 150, 150, .5)',
                })

                if(!result.isConfirmed) return;

                this.busy = true;
                const response = await FinancesServices.storeInvestiment(this.$route.query.eventId, this.investment)

                if(response?.status === 201){
                    this.$toast.add({severity: 'success', summary: 'Success', detail: 'Investimento criado com sucesso', life: 2000})
                    this.$emit('created')
                    this.handlehidden()
                    this.reset();
                    return
                }

                this.handleErrorMessage()
            }catch (error) {
                console.error(error);
                this.handleErrorMessage()
            } finally {
                this.busy = false;
            }
        },

        verifyRequiredFields(){
            return this.investment.amount > 0 && this.investment.name
        },

        handleErrorMessage(message = 'Erro ao adicionar o investimento'){
            this.$toast.add({
                    severity: 'error',
                    summary: 'Error', 
                    detail: message, 
                    life: 2000
            })
        },

        reset(){
            this.investment = {
                name: '',
                amount: 0
            }
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Investimento" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-1 grow">
                    <label for="name">
                        Nome
                    </label>
                    <InputText size="small" v-model="investment.name" id="name" placeholder="Ex:. Investimento Inicial" class="w-full h-9" />
                </div>
                
                <div class="flex flex-col gap-1 grow">
                    <label for="value">
                        Valor
                    </label>

                    <InputNumber size="small" v-model="investment.amount" id="value" placeholder="Ex:. 100 000 kz" class="w-full h-9" 
                    mode="currency" currency="AOA" locale="pt-AO" :min="0" :max="1000000"
                />
                </div>
        </div>

        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleStore" size="small" class="h-9" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
        </template>
    </Dialog>
</template>