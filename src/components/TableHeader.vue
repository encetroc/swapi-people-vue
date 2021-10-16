<template>
    <th>
        <div class="table-header">
            {{ props.header }}
            <div class="sort-btns">
            <button @click="() => changeSortCriteria('asc')">&#8593;</button>
            <button @click="() => changeSortCriteria('des')">&#8595;</button>
            </div>
        </div>
    </th>
</template>

<script>
export default {
    props: {
        header: { type: String },
        index: { type: Number },
        type: { type: String }
    },
    setup(props, context) {
        const changeSortCriteria = (order = 'asc') => {
            context.emit('changeSortCriteria', {
                sortIndex: props.index,
                sortBy: props.header,
                sortType: props.type,
                sortOrder: order
            })
        }
        return { props, changeSortCriteria }
    }
}
</script>

<style>
.table-header {
    display: flex;
    flex: 1;
    padding: 0.5rem 0.7rem;
    justify-content: space-around;
    align-items: center;
}

.sort-btns {
    display: flex;
    flex-direction: row;
}

.sort-btns button {
    padding: .2rem;
    margin: .2rem;
    cursor: pointer;
    font-size: 1.1rem;
    background: none;
}
</style>
