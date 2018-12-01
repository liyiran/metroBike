<template>
    
    <div class="container-fluid">
        <!-- <h3>Bike station distribution in Mapbox and D3</h3> -->
        <!-- <div class="jumbotron jumbotron-fluid"> -->
            <div class="container" >
                <br/>
                <h3 class="display-4" style="text-align:center">Bike Borrowing and Returning</h3>
                <ul>
                    <li>The Mapbox below shows the station distribution. Click a button to zoom in to the selected region.</li>
                    <li>The two bar charts on the right side of the map show the bike borrowing and returning amount related to the time in a day.</li>
                    <li>The waterfall chart shows the the difference between borrow and return rate. If a station has too many borrow rate but too little return rate, the company has to use a truck to carry bikes from other stations and fill this station.</li>
                    <!-- <li></li> -->
                </ul>
                <div class="alert alert-info">
                    Click a station on the map will show the detailed information of this station.
                </div>
                <br/>
            </div>
        <!-- </div> -->
        <div class="row">
            <div class="col-6">
                <StationMapBox/>
            </div>
            <div class="col-6">
                <div class="row">
                    <div class="col">
                        <StartStationHourCount/>
                    </div>
                    <div class="col">
                        <EndStationHourCount/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <DiffWaterfallChart/>
            </div>
        </div>
    </div>
</template>

<script>
    import StationMapBox from './StationMapBox'
    import StartStationHourCount from './StartStationHourCount'
    import EndStationHourCount from './EndStationHourCount'
    import DiffWaterfallChart from './DiffWaterfallChart'

    export default {
        name: "RegionView",
        components: {
            StartStationHourCount,
            EndStationHourCount,
            DiffWaterfallChart,
            StationMapBox,
        }
    }
</script>

<style scoped>

</style>