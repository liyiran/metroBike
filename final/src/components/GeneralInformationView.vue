<template>
   <div>
       <div class="container" >
           <StationD3DotMap/>
       </div>
       <div class="container" >
           <AverageMonthLineChart/>
       </div>
       <div class="container" >
           <CountByRegion/>
       </div>
   </div>
</template>

<script>
    import StationD3DotMap from './StationD3DotMap'
    import AverageMonthLineChart from './AverageMonthLineChart'
    import CountByRegion from './CountByRegion'
    // import AOS from 'aos'
    // import 'aos/dist/aos.css'
    export default {
        name: "GeneralInformationView",
        components: {
            StationD3DotMap,
            AverageMonthLineChart,
            CountByRegion
        },
    }
   
</script>

<style scoped>

</style>