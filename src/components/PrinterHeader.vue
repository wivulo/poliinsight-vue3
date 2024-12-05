<script>
import ISPBLogo from '@/views/statistic_repots/reports/components/ISPBLogo.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'PrinterHeader',
    components: {
        ISPBLogo
    },
    props: {
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    }
}
</script>

<template>
    <div class="flex flex-col items-center mb-6">
        <ISPBLogo />

        <div class="text-center text-lg">
            <p >Instituto Superior Politécnico de Benguela</p>
            <p>Departamento de {{user?.department?.name ?? 'Engenharia'}}</p>
            <p>{{ type }}</p>
        </div>
    </div>
</template>