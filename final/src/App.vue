<template>
    <div id="app" class="container-fluid">
        
        <nav class="site-header sticky-top py-1 navbar navbar-dark bg-dark">
            <div class="container d-flex flex-column flex-md-row justify-content-between">
                <a class="py-2" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-block mx-auto"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                </a>
                <a class="py-2 d-none d-md-inline-block" href="#StationD3">StationD3</a>
                <a class="py-2 d-none d-md-inline-block" href="#StationMapBox">StationMapBox</a>
                <a class="py-2 d-none d-md-inline-block" href="#StartStationHourCount">StartStationHourCount</a>
                <a class="py-2 d-none d-md-inline-block" href="#">EndStationHourCount</a>
                <a class="py-2 d-none d-md-inline-block" href="#">Support</a>
                <a class="py-2 d-none d-md-inline-block" href="#">DiffWaterfallChart</a>
                <a class="py-2 d-none d-md-inline-block" href="#">AverageMonthLineChart</a>
                <a class="py-2 d-none d-md-inline-block" href="#">CountByRegion</a>
            </div>
        </nav>

        <StationMapBox/>
        <StartStationHourCount/>
        <EndStationHourCount/>
        <DiffWaterfallChart/>
        <CountByRegion/>
        <AverageMonthLineChart/>
    </div>
</template>

<script>
    import StationD3DotMap from './components/StationD3DotMap'
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
            StationD3DotMap,
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
