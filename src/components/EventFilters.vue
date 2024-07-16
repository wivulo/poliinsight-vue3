<script>
export default {
    name: "EventFilters",
    data(){
        return {
            filters: {
                organizer: null,
                name: null,
                creationDate: null,
                startDate: null,
                status: null,
                participants: null
            },
        }
    }
}
</script>

<template>
    <div>
        <div>
            <h6>Filtrar por</h6>
        </div>

        <div class="w-100"></div>
        <div>
                <div>
                    <select name="filter-organizar" v-model="filters.organizer" class="form-select form-select-sm">
                        <option value="none" selected>__selecione um organizador</option>
                        <option v-for="(op, i) in [1, 2, 4, 5, 6]" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <div label-class="text-md">
                    <InputText v-model="filters.organizer" type="text" placeholder="Nome..."></InputText>
                </div>
            </div>

            <div>
                <select name="filter-organizar" v-model="filters.status" class="form-select form-select-sm">
                    <option value="none" selected>__selecione um status</option>
                    <option v-for="(op, i) in ['brevemente','ocorrendo','terminado', 'cancelado']" :value="op" :key="i">
                        {{ op }}
                    </option>
                </select>
            </div>

            <div>
                <div label="criados em" label-class="text-md">
                    <Calendar v-model="filters.creationDate" placeholder="Data de criação..."></Calendar>
                </div>

                <div label="criados em" label-class="text-md">
                    <Calendar v-model="filters.startDate" placeholder="Data de início..."></Calendar>
                </div>
            </div>

            <div>
                <div>
                    <select name="filter-organizar" v-model="filters.participants" class="form-select form-select-sm">
                        <option value="none" selected>__selecione o nª de participantes</option>
                        <option v-for="(op, i) in [1, 2, 4, 5, 6]" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>
    </div>
</template>