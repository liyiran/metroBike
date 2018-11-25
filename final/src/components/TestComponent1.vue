<template>
    <div>
        <h1>第一个部分</h1>
        <select @change="biantian()" v-model="core">
            <option v-for="core in cores" v-bind:value="core.key" >{{core.display}}</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: "TestComponent1",
        data() {
            return {
                core:{},
                cores: [
                    {
                        key: '3005',
                        display: '包子'
                    }, {
                        key: '3006',
                        display: '涛哥'
                    }, {
                        key: '3007',
                        display: '长者'
                    }, {
                        key: '3007',
                        display: '设计师'
                    }
                ]
            }
        },
        methods: {
            biantian() {
                console.log(this.core);
                this.$root.$emit('change-station', this.core);
            }
        }
    }
</script>

<style scoped>

</style>