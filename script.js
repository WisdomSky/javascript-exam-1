

// register the DigitLed component
Vue.component('DigitLed', DigitLed);
Vue.component('WeatherChart', WeatherChart);
Vue.component('WeatherItem', WeatherItem);

// install the plug-in
Vue.use(OpenWeather, {
    appKey      : '2ca6435c995e70ab53a860886c64976b'
});


new Vue({
    el: '#vueapp',
    data: function () {
        return {
            value: '',
            countryCode : 'AU',
            weatherData: null,
            error: false,
            loading: false,
            request: null
        }
    },
    mounted: function () {
        // persistent focus to the hidden input
        $(document)
            .on('click', function () {

                // set the focus to the input when the document is clicked
                $(this.$refs.input).focus();

            }.bind(this))
            .on('keydown', function (e) {

                // disable left arrow key
                if (e.which === 37)
                    return false;

            })
            .trigger('click');
    },
    watch: {
        value: function () {

            // abort currently running request before making a new one
            if (this.request !== null) {

                this.request.reject();

            }

            // remove error status
            this.error = false;

            // check if value is not empty
            if (this.rvalue.length) {

                // make an api call
                this.getWeatherForecastDebounced();

            } else {

                // cancel call if the user has emptied the input
                this.getWeatherForecastDebounced.cancel();
                this.weatherData = null;

            }

        },
        error: function (error) {

            if (error)
                $('body').addClass('error');
            else
                $('body').removeClass('error');

        },
        loading: function (loading) {

            this.animateDigits(loading);

            if (loading) {

                this.weatherData = null;

            }

        }
    },
    computed: {
        // convert the string value into array of characters while stripping all non-digit characters
        rvalue: function () {

            return String(this.value).trim().replace(/[^\d]/g, '').split('');

        },
        // wrap the method around debounce to avoid spamming the function call when the user quickly changes the value
        getWeatherForecastDebounced: function () {

            return _.debounce(this.getWeatherForecast, 1000);

        },
        cities: function () {
            return this.weatherData.cities ? this.weatherData.cities.join(', ') : this.weatherData.city.name;
        }
    },
    methods: {
        getWeatherForecast: function () {

            this.loading = true;

            this.weatherData = null;


            // query weather data
            this.request = this.$weather.get('forecast/daily', {
                zip: this.value + ',' + this.countryCode,
                cnt: 7,
                units: 'metric'
            });


            // response handler
            this.request.done(function (data) {
                this.weatherData = data;
            }.bind(this));


            // set error status when request fails
            this.request.fail(function () {

                this.error = true;

            }.bind(this));


            // set error status when request fails
            this.request.always(function () {

                this.loading = false;

            }.bind(this));



        },
        // staggered jumping animation for the digits
        animateDigits: function (animate) {

            animate = animate !== undefined && typeof animate === 'boolean' ? animate : true;

            for (var i=0; i<this.rvalue.length;i++) {
                $(this.$refs['digit-' + i][0].$el).removeClass('loading');

                if (animate) {
                    setTimeout((function (index) {
                        return function () {

                            if (this.loading) $(this.$refs['digit-' + index][0].$el).addClass('loading');

                        }.bind(this);
                    }.bind(this))(i), (i+1) * 100);
                }

            }
        },
    }
});
