<template>
<div>
    <section class="ui two column centered grid" style="position:relative;z-index:1">
        <div class="column">
            <form action="" class="ui segment form">
                <div class="ui message red" v-show="error">{{error}}</div>
                <div class="ui segment">
                    <div class="field">
                        <div class="ui right icon input large" :class="{loading:spinner}">
                            <input type="text" name="" placeholder="Enter your address" v-model="address" ref="autocomplete">
                            <i class=" dot circle link icon" @click="locatorButtonPressed"></i>
                        </div>
                    </div>
                    <button class="ui button">Go</button>
                </div>
            </form>
        </div>
    </section>
    <section id="map">

    </section>
</div>
</template>

<script>

import axios from 'axios'
export default {
    data() {
        return {
            address:"",
            error:"",
            spinner:false,
        }
    },
    mounted() {
        let autocomplete = new window.google.maps.places.Autocomplete(
            this.$refs.autocomplete,
            {
                bounds: new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(6.465422, 3.406448)
                )
        });
        autocomplete.addListener("place_changed", ()=>{
            let place = autocomplete.getPlace();
            console.log(place);
            this.showUserLocationOnTheMap(place.geometry.location.lat(),place.geometry.location.lng())
        });
    },
    methods: {
        locatorButtonPressed(){
            this.spinner = true;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position=>{
                        this.getAddressFrom(
                            position.coords.latitude,
                            position.coords.longitude);
                        this.showUserLocationOnTheMap(
                            position.coords.latitude,
                            position.coords.longitude);
                        console.log(position.geometry);
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
            })
            .catch(error=>{
                this.error = error.message;
                this.spinner = false;
                // console.log(error.message);
            });
        },
        showUserLocationOnTheMap(latitude,longitude){
            let map = new window.google.maps.Map(document.getElementById("map"),{
                zoom:15,
                center: new window.google.maps.LatLng(latitude,longitude),
                mapTypeId: window.google.maps.MapTypeId.ROADMAP
            });

            new window.google.maps.Marker({
                position: new window.google.maps.LatLng(latitude, longitude),
                map:map
            });
        }
    },
};
</script>

<style>
    .ui.button,
    .dot.circle.icon{
        background-color: #ff5aff;
        color: #ffffff;
    }
    .pac-item:hover{color:green}
    /* .pac-item{padding: 10px;} Control Text item padding */
    /* .pac-icon{color:green;} Control marker icon style*/

    #map{
        position:absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background:red;
    }
</style>