<template>
    <div class="popup-container">
        <div class="popup">
            <h1 class="popup-title">Homeworld info</h1>
            <ul>
                <li><strong>Name:</strong> {{ props.name }}</li>
                <li><strong>Diametre:</strong> {{ props.diameter }}</li>
                <li><strong>Climate:</strong> {{ props.climate }}</li>
                <li><strong>Population:</strong> {{ props.population }}</li>
            </ul>
            <button class="close-btn" @click=" () => closePopup()">X</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: { type: String },
        diameter: { type: String },
        climate: { type: String },
        population: { type: String }
    },
    setup(props, context) {
        const closePopup = () => {
            context.emit('closePopup')
        }
        return { props, closePopup }
    }
}
</script>

<style>
.popup-container {
    font-size: 1.2rem;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(10px);
}

.popup {
    position: relative;
    background: white;
    padding: 4rem;
    opacity: 1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.close-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: .5rem;
    background: none;
    cursor: pointer;
}

.popup-title {
    font-size: 1.6rem;
}

ul {
    margin-top: 3rem;
}

li + li {
    margin-top: 1rem;
}
</style>
