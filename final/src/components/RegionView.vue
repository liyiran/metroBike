<template>
    <div class="container-fluid">
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
                    <div class="col">
                        <DiffWaterfallChart/>
                    </div>
                </div>
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