<script setup></script>

<template>
    <div id="container">
        <div id="modal">
            <div id="modal-title">
                <slot name="title" />
            </div>
            <slot name="content" />
        </div>
    </div>
</template>

<style scoped>
#container {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

#modal {
    border: 1px solid black;
    padding: 10px;
    position: relative;
    min-width: 250px;
}

#modal-title {
    position: absolute;
    top: 0;
    left: 5px;
    transform: translateY(-50%);
    padding: 0 5px;
    background-color: white;
}
</style>
