<template>
    <div id="app" class="container-fluid">
        <!--<TestComponent1/>-->

        <StationMapBox/>
        <StartStationHourCount/>
        <EndStationHourCount/>
        <DiffWaterfallChart/>
        <CountByRegion/>
        <AverageMonthLineChart/>
    </div>
</template>

<script>
    import EndStationHourCount from './components/EndStationHourCount'
    import StartStationHourCount from './components/StartStationHourCount'
    import DiffWaterfallChart from './components/DiffWaterfallChart'
    import BorrowReturnBarChart from './components/BorrowReturnBarChart'
    import BorrowReturnStackMap from './components/BorrowReturnStackMap'
    import StationMapBox from './components/StationMapBox'
    import UsagePieChart from './components/UsagePieChart'
    import AverageMonthLineChart from './components/AverageMonthLineChart'
    import CountByRegion from './components/CountByRegion'
    export default {
        name: 'app',
        components: {
            StartStationHourCount,
            EndStationHourCount,
            DiffWaterfallChart,
            // BorrowReturnBarChart,
            // BorrowReturnStackMap,
            StationMapBox,

            AverageMonthLineChart,

            CountByRegion

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
