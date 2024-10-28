<script>
/*
Despesas
  eventId     String
  amount      Float
  category    String
  description String?
*/
export default {
    name: "Finance.Expenses",
    created(){
        this.fetchExpenses();
    },
    methods: {
        fetchExpenses(){
            console.log('fetchExpenses');
        }
    },
    watch: {
        $route(){
            this.fetchExpenses();
        }
    },
}
</script>

<template>
    <div>
        <p>Despesas</p>
    </div>
</template>