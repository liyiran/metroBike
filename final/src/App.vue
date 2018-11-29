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
        <nav class="sticky-top navbar navbar-expand-lg navbar-light bg-light">
            <div class="d-flex flex-column flex-md-row justify-content-between">
                <a class="navbar-brand">
                    <img src="./assets/logo.png" height="30">
                </a>
                <router-link class="nav-item nav-link"  to="/general">General</router-link>
                <router-link class="nav-item nav-link"  to="/region">Region</router-link>
            </div>
        </nav>
        <div>
            <router-view></router-view>
        </div>
        <VueElevator :word="word" :duration="duration" :mainAudio="mainAudio" :endAudio="endAudio"></VueElevator>
    </div>
</template>

<script>
    import {VueElevator} from 'vue-elevator'
    export default {
        name: 'app',
        data() {
            return {
                word: "",
                duration: 4000,
                mainAudio: "http://tholman.com/elevator.js/music/elevator.mp3",
                endAudio: "http://tholman.com/elevator.js/music/ding.mp3",
            }
        },
        components: {
            VueElevator
        },
        mounted: function () {
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
</style>
