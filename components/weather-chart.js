/**
 * Created by macmini on 27/08/2017.
 * by Julian
 */

window.WeatherChart = {
    template: '<transition-group name="staggered" v-bind:css="false" v-on:before-enter="beforeEnter" v-on:enter="enter"'
            + 'v-on:leave="leave" mode="out-in" tag="div" class="weather-chart">'
            + '<weather-item :weather-item-data="item" v-bind:data-index="index" :key="String(index) + \'-\' + item.dt" v-for="(item, index) in data"></weather-item>'
            + '</transition-group>',
    props: ['weather-data'],
    data: function () {
        return {
            interval: 200
        }
    },
    computed: {
      data: function () {

          return this.weatherData ? this.weatherData.list : [];

      }
    },
    methods: {
        beforeEnter: function (el) {
            $(el).css('top', $(el).height());
        },
        enter: function (el, done) {
            var delay = el.dataset.index * this.interval;
            setTimeout(function () {
                $(el).animate({
                    top: 0
                }, done)
            }, delay)
        },
        leave: function (el, done) {
            var delay = el.dataset.index * this.interval;
            setTimeout(function () {
                $(el).animate({
                    top: $(el).height()
                }, done)
            }, delay)
        }
    }
};


window.WeatherItem = {
    template: '<div class="weather-chart-item">'
            + ' <div class="day-of-week">{{ dayOfWeek }}</div>'
            + ' <div class="date">{{ date }}</div>'
            + ' <div class="icon"><img :src="icon"></div>'
            + ' <div class="temp">'
            + '     <span class="min">{{ minTemp }}&#176;C</span>'
            + '     &nbsp;~&nbsp;'
            + '     <span class="min">{{ maxTemp }}&#176;C</span>'
            + ' </div>'
            + ' <div class="description">{{ description }}</div>'
            + '</div>',
    props: ['weather-item-data'],
    data: function () {
        return {
            iconBaseUrl: 'http://openweathermap.org/img/w/',
            iconExtension: '.png'
        }
    },
    computed: {
        dayOfWeek: function () {

            return moment(this.weatherItemData.dt * 1000).format('dddd');

        },
        date: function () {

            return moment(this.weatherItemData.dt * 1000).format('MMMM DD, YYYY');

        },
        icon: function () {

            // sometimes openweather returns a nighttime version of an icon even though the weather is based on
            // daytime, we just need to make sure to replace the `n` into `d` so that we can only get daytime icon
            return this.iconBaseUrl + this.weatherItemData.weather[0].icon.replace(/^(\d+)(n)/,'$1d') + this.iconExtension;

        },
        description: function () {

            // capitalize description
            return this.weatherItemData.weather[0].description.charAt(0).toUpperCase() + this.weatherItemData.weather[0].description.substring(1);

        },
        minTemp: function () {
            return Math.round(this.weatherItemData.temp.min);
        },
        maxTemp: function () {
            return Math.round(this.weatherItemData.temp.max);
        }
    }
};