import { ref, reactive, computed } from '@vue/reactivity'
import axios from 'axios'

export const useFetch = (url, config = {}) => {
    const data = ref(null)
    const response = ref(null)
    const error = ref(null)
    const loading = ref(false)

    const fetch = async () => {
        loading.value = true
        try {
            const result = await axios.request({
                url,
                ...config
            })
            response.value = result
            data.value = result.data
        } catch (ex) {
            error.value = ex
        } finally {
            loading.value = false
        }
    }

    !config.skip && fetch()

    return { response, error, data, loading, fetch }
}

const cacheMap = reactive(new Map())

export const useFetchCash = (key, url, config = {}) => {
    const info = useFetch(url, { skip: true, ...config })

    const update = () => cacheMap.set(key, info.response.value)
    const clear = () => cacheMap.set(key, undefined)

    const fetch = async () => {
        try {
            await info.fetch()
            update()
        } catch {
            clear()
        }
    }

    const response = computed(() => cacheMap.get(key))
    const data = computed(() => response.value?.data)

    if (response.value == null) fetch()

    return { data, response, clear, fetch }
}

export const useFetchPeople = () => {
    const info = useFetchCash(
        'https://swapi.dev/api/people',
        'https://swapi.dev/api/people'
    )

    return { ...info }
}

export const useRichContentPeople = () => {
    const info = useFetchPeople()

    const richContentPeople = computed(() => {
        return info.data.value?.results.map((person) => {
            {
                delete person.hair_color
                delete person.skin_color
                delete person.eye_color
                delete person.birth_year
                delete person.gender
                delete person.films
                delete person.species
                delete person.vehicles
                delete person.starships
                delete person.url
            }
            const richContentPerson = Object.entries(person).map(
                ([key, value]) => {
                    let raw = ''
                    let presentable = ''
                    let sortable = ''
                    let type = ''
                    let richContent = {}

                    switch (key) {
                        case 'name':
                            raw = value
                            presentable = value
                            sortable = value
                            type = 'string'
                            break
                        case 'height':
                        case 'mass':
                            raw = value
                            presentable = value
                            sortable = value
                            type = 'number'
                            break
                        case 'created':
                        case 'edited':
                            {
                                const date = new Date(value)
                                raw = value
                                presentable = date.toDateString()
                                sortable = date.getTime()
                                type = 'number'
                                richContent = {
                                    dateObject: date
                                }
                            }
                            break
                        case 'homeworld':
                            {
                                const { data } = useFetchCash(value, value)
                                raw = value
                                presentable = data.value?.name
                                sortable = data.value?.name
                                type = 'string'
                                richContent = data.value
                            }
                            break
                    }

                    const result = {
                        key,
                        raw,
                        presentable,
                        sortable,
                        type,
                        richContent
                    }
                    return result
                }
            )
            return richContentPerson
        })
    })

    return { richContentPeople }
}

export const useSortPeople = (richContentPeople, sortCriteria) => {
    const richContentPeopleCopy = computed(() => {
        return [...richContentPeople.value]
    })

    const sortPeople = (array, sortIndex, sortType, sortOrder) => {
        switch (sortType) {
            case 'string':
                return array.value.sort((a, b) => {
                    if (a[sortIndex].sortable < b[sortIndex].sortable) {
                        if (sortOrder === 'asc') return -1
                        else if (sortOrder === 'des') return 1
                        else return 0
                    }
                    if (a[sortIndex].sortable > b[sortIndex].sortable) {
                        if (sortOrder === 'asc') return 1
                        else if (sortOrder === 'des') return -1
                        else return 0
                    }
                    return 0
                })
            case 'number':
                return array.value.sort((a, b) => {
                    if (sortOrder === 'asc') return a[sortIndex].sortable - b[sortIndex].sortable
                    else if (sortOrder === 'des') return b[sortIndex].sortable - a[sortIndex].sortable
                    else return 0
                })
        }
    }

    const sortedRichContentPeople = computed(() => {
        if (sortCriteria.sortIndex !== null) {
            return sortPeople(richContentPeopleCopy, sortCriteria.sortIndex, sortCriteria.sortType, sortCriteria.sortOrder)
        } else {
            return richContentPeople.value
        }
    })

    return { sortedRichContentPeople }
}

export const useFilterPeople = (richContentPeople, filterBy) => {
    const richContentPeopleCopy = computed(() => {
        return [...richContentPeople.value]
    })

    const filteredRichContentPeople = computed(() => {
        if (filterBy.value !== '') {
            return richContentPeopleCopy.value.filter(person => {
                return person[0].presentable.toLowerCase().includes(filterBy.value.toLowerCase())
            })
        } else {
            return richContentPeople.value
        }
    })

    return { filteredRichContentPeople }
}
