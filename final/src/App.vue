<template>
    <div id="app" class="container-fluid">
        <div id="section1" class="container-fluid">
            <div class="container" style="margin-top: 2%;">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <p>Metro bike usage research</p>
                        <p align="center">Yiran Li</p>
                        <p align="center">Yueqin Yang</p>
                        <p align="center">Xiner Ning</p>
                    </div>

                </div>
            </div>
        </div>
        <nav class="site-header sticky-top py-1 navbar navbar-dark bg-dark">
            <div class="container d-flex flex-column flex-md-row justify-content-between">
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
        <div class="container">
            <StationD3DotMap/>
        </div>
        <div class="container">
            <StationMapBox/>
        </div>
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
    import StationMapBox from './components/StationMapBox'
    import AverageMonthLineChart from './components/AverageMonthLineChart'
    import CountByRegion from './components/CountByRegion'
    import StationD3DotMap from './components/StationD3DotMap'
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
            StationD3DotMap,
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

    #section1 {
        padding-top: 150px;
        padding-bottom: 100px;
        color: #ffffff;;
        height: 700px;
        background-image: url("./assets/one-tap-account.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        font-weight: 700;
        font-size: 67px;
    }
</style>
