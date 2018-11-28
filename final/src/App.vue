<template>
    <div id="app" class="container-fluid">
        <!--<TestComponent1/>-->
        <StationMapBox/>
        <StartStationHourCount/>
        <EndStationHourCount/>
        <DiffWaterfallChart/>
        <countByRegion/>
        <AverageMonthLineChart/>
        <!--<img src="./assets/logo.jpg"/>-->
        <!--<BorrowReturnBarChart/>-->
        <!--<BorrowReturnStackMap/>-->
        <!--<TestComponent1/>-->
        <!--<TestComponent2/>-->
        <!--<UsagePieChart/>-->
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
    import TestComponent1 from './components/TestComponent1'
    import TestComponent2 from './components/TestComponent2'
    import countByRegion from './components/countByRegion'
    import AverageMonthLineChart from './components/AverageMonthLineChart'

    export default {
        name: 'app',
        components: {
            StartStationHourCount,
            EndStationHourCount,
            DiffWaterfallChart,
            // BorrowReturnBarChart,
            // BorrowReturnStackMap,
            StationMapBox,
            // UsagePieChart
            TestComponent1,
            TestComponent2,
            countByRegion,
            AverageMonthLineChart
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
