<script>
import SingleInformation from './SingleInformation.vue';

export default {
    name: 'Registration.CompanyInformation',
    props: ['fields'],
    components: {
        SingleInformation
    },
    computed: {
        orderedFields(){
            console.log(this.fields)
        }
    }
}
</script>

<template></template>