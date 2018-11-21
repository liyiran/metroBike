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
                        key: 'xijinping',
                        display: '包子'
                    }, {
                        key: 'hujintao',
                        display: '涛哥'
                    }, {
                        key: 'jiangzemin',
                        display: '长者'
                    }, {
                        key: 'dengxiaoping',
                        display: '设计师'
                    }
                ]
            }
        },
        methods: {
            biantian() {
                console.log(this.core);
                this.$root.$emit('change-leader', this.core);
            }
        }
    }
</script>

<style scoped>

</style>