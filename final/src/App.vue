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
            <div class="d-flex flex-column flex-md-row justify-content-between">
                <a class="navbar-brand">
                    <img src="./assets/logo.png" height="30">
                </a>
                <!--<a class="py-2 d-none d-md-inline-block" href="#StationD3">StationD3</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#StationMapBox">StationMapBox</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#StartStationHourCount">StartStationHourCount</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#">EndStationHourCount</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#">Support</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#">DiffWaterfallChart</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#">AverageMonthLineChart</a>-->
                <!--<a class="py-2 d-none d-md-inline-block" href="#">CountByRegion</a>-->
            </div>
        </nav>
        <div class="container" data-aos="fade-up">
            <StationD3DotMap/>
        </div>
        <div class="container" data-aos="flip-left">
            <AverageMonthLineChart/>
        </div>
        <div class="container" data-aos="flip-left">
            <CountByRegion/>
        </div>
        <div class="container" data-aos="flip-left">
            <StationMapBox/>
        </div>
        <div class="container" data-aos="flip-left">
            <StartStationHourCount/>
        </div>
        <div class="container" data-aos="flip-left">
            <EndStationHourCount/>
        </div>
        <div class="container" data-aos="flip-left">
            <DiffWaterfallChart/>
        </div>
        <VueElevator :duration="duration" :mainAudio="mainAudio" :endAudio="endAudio"></VueElevator>
        <footer class="social">
            <div class="footer py-3">
                You current choice is: DTLA
            </div>
        </footer>
    </div>
</template>

<script>
    import EndStationHourCount from './components/EndStationHourCount'
    import StartStationHourCount from './components/StartStationHourCount'
    import DiffWaterfallChart from './components/DiffWaterfallChart'
    import StationMapBox from './components/StationMapBox'
    import AverageMonthLineChart from './components/AverageMonthLineChart'
    import CountByRegion from './components/CountByRegion'
    import StationD3DotMap from './components/StationD3DotMap'
    import {VueElevator} from 'vue-elevator'
    import AOS from 'aos'
    import 'aos/dist/aos.css'

    export default {
        name: 'app',
        data() {
            return {
                // Replace word, duration, mainAudio and endAudio setting as you want.
                // If default is what you like, just don't use related key-value pair and ignore it.
                word: "Go to Top",
                duration: 4000,
                mainAudio: "http://tholman.com/elevator.js/music/elevator.mp3",
                endAudio: "http://tholman.com/elevator.js/music/ding.mp3",
            }
        },
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
            VueElevator,
            CountByRegion

        },
        mounted: function () {
            AOS.init()
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

    #app {
        background-image: url(./assets/background.png)
    }

    .social {
        float: right;
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        color:black;
    }
</style>
