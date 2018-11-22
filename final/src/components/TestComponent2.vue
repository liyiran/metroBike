<template>
    <!--<div class="container-fluid">-->
        <div class="row">
            <div class="col">
                <h1>第二个部分接收一个event</h1>
                这里显示传进来的值<p>{{text}}</p>
            </div>
        </div>
    <!--</div>-->
</template>

<script>
    export default {
        name: "TestComponent2",
        data: function () {
            return {text: "undefined"}
        },
        methods: {
            changeLeader(value) {
                console.log(value);
                this.text = value;
            }
        },
        mounted() {
            this.$root.$on('change-station', (newLeader) => {
                this.changeLeader(newLeader);
            })
        }
    }
</script>

<style scoped>

</style>