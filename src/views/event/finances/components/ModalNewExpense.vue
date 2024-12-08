<script>
import FinancesServices from '@/services/FinancesServices.js';
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import currency from '@/helpers/currency';

export default {
    name: "ModalNewInvestiment",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown, Textarea,
    },
    data(){
        return {
            visible: false,
            busy: false,
            expense: {
                amount: 0,
                eventId: null,
                category: null,
                description: null,
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
                const response = await FinancesServices.storeExpense(this.$route.query.eventId, this.expense)
                .catch(() => this.handleErrorMessage())

                if(response?.status === 201){
                    this.$toast.add({severity: 'success', summary: 'Success', detail: 'Despesa criada com sucesso', life: 2000})
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
            return this.expense.amount > 0 && this.expense.category
        },

        handleErrorMessage(message){
            this.$toast.add({
                severity: 'error',
                summary: 'Error', 
                detail: message || 'Ocorreu um erro ao processar a sua solicitação', 
                life: 2000
            })
        },

        reset(){
            this.expense = {
                name: '',
                amount: 0,
                eventId: null,
                category: null,
                description: null,
            }
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
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
    <Dialog v-model:visible="visible" modal header="Despesa" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-end">
                <div class="flex flex-col gap-1 grow">
                    <label for="category">
                        Categoria
                    </label>

                    <InputText size="small" v-model="expense.category" id="category" placeholder="Ex:. Alimentação" class="w-full h-9" />
                </div>
                
                <div class="flex flex-col gap-1 grow">
                    <label for="value">
                        Montante
                    </label>

                    <InputNumber size="small" v-model="expense.amount" id="value" placeholder="Ex:. 100 000 kz" class="w-full h-9" 
                        mode="currency" currency="AOA" locale="pt-AO" :min="0" :max="1000000"
                    />
                </div>
            </div>

            <div class="flex gap-2 items-end mt-2">
                <div class="flex flex-col gap-1 grow">
                    <label for="description">
                        Descrição
                    </label>

                    <Textarea v-model="expense.description" id="description" rows="2"
                        placeholder="Ex:. Pequeno almoço para os participantes" class="w-full hover:border-slate-400" 
                    />
                </div>
            </div>
        </div>

        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleStore" size="small" class="h-8" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
        </template>
    </Dialog>
</template>