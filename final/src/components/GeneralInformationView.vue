<template>
   <div>
       <div class="container" data-aos="flip-left">
           <StationD3DotMap/>
       </div>
       <div class="container" data-aos="flip-left">
           <AverageMonthLineChart/>
       </div>
       <div class="container" data-aos="flip-left">
           <CountByRegion/>
       </div>
   </div>
</template>

<script>
    import StationD3DotMap from './StationD3DotMap'
    import AverageMonthLineChart from './AverageMonthLineChart'
    import CountByRegion from './CountByRegion'
    import AOS from 'aos'
    import 'aos/dist/aos.css'
    export default {
        name: "GeneralInformationView",
        components: {
            StationD3DotMap,
            AverageMonthLineChart,
            CountByRegion
        },
        mounted: function () {
            AOS.init()
        }
    }
   
</script>

<style scoped>

</style>