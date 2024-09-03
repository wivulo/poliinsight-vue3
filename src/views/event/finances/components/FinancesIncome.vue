<script>
export default {
    name: "Finance.Income",
    created(){
        this.fetchIncome();
    },
    methods: {
        fetchIncome(){
            console.log('fetchIncome');
        }
    },
    watch: {
        $route(){
            this.fetchIncome();
        }
    },
}
</script>

<template>
    <div>
        <p>Receitas</p>
    </div>
</template>