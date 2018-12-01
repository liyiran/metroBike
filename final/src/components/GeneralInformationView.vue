<template>
   <div class="container-fluid">
       <div class="container" >
           <br/>                
            <h3 class="display-4" style="text-align:center">L.A. Metro Bike Station Distribution</h3>
            
            <br/>
           <StationD3DotMap/>
       </div>
       <div class="container" >
            <br/>                
            <h3 class="display-4" style="text-align:center">Time History for Bike Usage</h3>
            <ul>
                <li>This graph portraits bike usage against time.</li>
                <li>You can find that summer and spring are two popular season but winter is the least popular season.</li>
                <li>Except DTLA (Downtown of LA), all areas are missing some data because they are NEW areas established recently.</li>
            </ul>
            <br/>
           <AverageMonthLineChart/>
       </div>
       <div class="container" >
            <br/>                
            <h3 class="display-4" style="text-align:center">Average Bike Usage per Station by Region</h3>
            <ul>
                <li>This graph portraits average bike usage against region.</li>
                <li>You can find that Venice is even more popular than DTLA although it is an new area.</li>
                <li>Please notice that only DTLA has all data for all months.</li>
            </ul>
            <br/>
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
        // mounted: function () {
        //     AOS.init()
        // }
    }
   
</script>

<style scoped>

</style>