<script>
export default {
    name: 'DynamicTable',
    props: {
      headers: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true
      }
    }
};
</script>

<template>
    <table>
        <thead>
            <tr>
                <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                    <slot :name="`cell-${rowIndex}-${cellIndex}`" :value="cell">{{ cell }}</slot>
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td><strong>Total</strong></td>
                <td></td>
                <td>{{toKwanza(totalFinances(investiments))}}</td>
            </tr>
        </tfoot>
    </table>
</template>