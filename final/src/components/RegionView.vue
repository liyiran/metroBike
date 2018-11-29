<template>
    <div>
        <div class="container">
            <StationMapBox/>
        </div>
        <div class="container">
            <StartStationHourCount/>
        </div>
        <div class="container">
            <EndStationHourCount/>
        </div>
        <div class="container">
            <DiffWaterfallChart/>
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
        comments: {
            StartStationHourCount,
            EndStationHourCount,
            DiffWaterfallChart,
            StationMapBox,
        }
    }
</script>

<style scoped>

</style>