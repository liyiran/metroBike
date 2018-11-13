<template>
    <div id="app" class="container">
        <!--<img src="./assets/logo.jpg"/>-->
        <!--<BorrowReturnBarChart/>-->
        <!--<BorrowReturnStackMap/>-->
        <StationDotMap/>
        <!--<UsagePieChart/>-->
    </div>
</template>

<script>
    import BorrowReturnBarChart from './components/BorrowReturnBarChart'
    import BorrowReturnStackMap from './components/BorrowReturnStackMap'
    import StationDotMap from './components/StationDotMap'
    import UsagePieChart from './components/UsagePieChart'

    export default {
        name: 'app',
        components: {
            BorrowReturnBarChart,
            BorrowReturnStackMap,
            StationDotMap,
            UsagePieChart
        }
    }
</script>
<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
<style>
    @import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
