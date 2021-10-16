<template>
    <LoadingScreen v-if="loading" />
    <div class="container" v-else>
        <Homeworld
            v-if="selectedHomeworld.name !== ''"
            :name="selectedHomeworld.name"
            :diameter="selectedHomeworld.diameter"
            :climate="selectedHomeworld.climate"
            :population="selectedHomeworld.population"
            @closePopup="() => checkHomeworld({key: ''})"
        />
        <input class="search-input" placeholder="Search by name" v-model="searchInput" />
        <table class="fixed">
            <col width="50px" />
            <col width="30px" />
            <col width="30px" />
            <col width="40px" />
            <col width="50px" />
            <col width="50px" />
            <thead>
                <tr>
                    <TableHeaderVue
                        v-for="(attribute, index) in sortedRichContentPeople[0]"
                        :key="attribute.key"
                        :header="attribute.key"
                        :index="index"
                        :type="attribute.type"
                        @changeSortCriteria="
                            (criteria) => changeSortCriteria(criteria)
                        "
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="person in filteredRichContentPeople"
                    :key="person[0].raw"
                >
                    <td
                        class="table-cell"
                        v-for="attribute in person"
                        :key="`${attribute.key}${attribute.raw}`"
                        @click="() => checkHomeworld(attribute)"
                        :style="{
                            color: attribute.key === 'homeworld' ? 'blue' : 'inherit',
                            textDecoration: attribute.key === 'homeworld' ? 'underline' : 'none',
                            cursor: attribute.key === 'homeworld' ? 'pointer' : 'inherit'
                            }"
                    >
                        {{ attribute.presentable }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {
    useFetchPeople,
    useRichContentPeople,
    useSortPeople,
    useFilterPeople
} from '@/functions/useFetch'
import { ref, reactive } from '@vue/reactivity'
import TableHeaderVue from '@/components/TableHeader.vue'
import Homeworld from '@/components/Homeworld.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

export default {
    name: 'App',
    components: { TableHeaderVue, Homeworld, LoadingScreen },
    setup() {
        const searchInput = ref('')
        const sortCriteria = reactive({
            sortIndex: null,
            sortBy: '',
            sortType: '',
            sortOrder: 'asc'
        })
        const selectedHomeworld = reactive({
            name: '',
            diameter: '',
            climate: '',
            population: ''
        })
        const changeSortCriteria = (criteria) => {
            sortCriteria.sortIndex = criteria.sortIndex
            sortCriteria.sortBy = criteria.sortBy
            sortCriteria.sortType = criteria.sortType
            sortCriteria.sortOrder = criteria.sortOrder
        }
        const checkHomeworld = (attribute) => {
            if (attribute.key === 'homeworld') {
                selectedHomeworld.name = attribute.richContent.name
                selectedHomeworld.diameter = attribute.richContent.diameter
                selectedHomeworld.climate = attribute.richContent.climate
                selectedHomeworld.population = attribute.richContent.population
            } else {
                selectedHomeworld.name = ''
            }
        }

        const { response, error, data, loading } = useFetchPeople()
        const { richContentPeople } = useRichContentPeople()
        const { sortedRichContentPeople } = useSortPeople(
            richContentPeople,
            sortCriteria
        )
        const { filteredRichContentPeople } = useFilterPeople(
            sortedRichContentPeople,
            searchInput
        )
        return {
            checkHomeworld,
            changeSortCriteria,
            filteredRichContentPeople,
            sortedRichContentPeople,
            richContentPeople,
            selectedHomeworld,
            searchInput,
            response,
            error,
            data,
            loading
        }
    }
}
</script>

<style>
table,
th,
td {
    border: 1px solid black;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 5px;
}

table.fixed { table-layout:fixed; }
table.fixed td { overflow: hidden; }

.container {
    font-size: 1.2rem;
    position: relative;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
}

.search-input {
    background: rgb(218, 218, 218);
    padding: 1rem;
    margin: 1rem;
}

.table-cell {
    padding: 1rem;
}
</style>
