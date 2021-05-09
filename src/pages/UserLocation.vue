<template>
    <section class="ui two colum centered grid">
        <div class="column">
            <form action="" class="ui segment large form">
                <div class="ui message red" v-show="error">{{error}}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{loading:spinner}">
                            <input type="text" name="" placeholder="Enter your address" v-model="address">
                            <i class=" dot circle link icon" @click="locatorButtonPressed"></i>
                        </div>
                    </div>
                    <button class="ui button">Go</button>
                </div>
            </form>
        </div>
    </section>
</template>

<script>

import axios from 'axios'
export default {
    data() {
        return {
            address:"",
            error:"",
            spinner:false
        }
    },
    methods: {
        locatorButtonPressed(){
            this.spinner = true;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position=>{
                        this.getAddressFrom(position.coords.latitude,position.coords.longitude)
                    },
                    error=>{
                        this.error =error.message; 
                        // this.error = "The locator was denied permission to find your address. Please allow/enable your location or enter your address manually";
                        this.spinner = false;
                        // console.log(error.message);
                    }
                );
            }
            else{
                console.log("Your browser does not support geolocation API");
            }
        },
        getAddressFrom(lat,long){
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=Your_API_KEY").then(response=>{
                if (response.data.error_message) {
                    this.error = response.data.error_message;
                    this.spinner = false;
                    // console.log(response.data.error_message);
                }
                else{
                    this.address = response.data.results[0].formatted_address; 
                    this.spinner = false;
                    // console.log(response.data.results[0].formatted_address);
                }
            }).catch(error=>{
                this.error = error.message;
                this.spinner = false;
                // console.log(error.message);
            })
        }
    },
}
</script>

<style>
    .ui.button,
    .dot.circle.icon{
        background-color: #ff5aff;
        color: #ffffff;
    }
</style>