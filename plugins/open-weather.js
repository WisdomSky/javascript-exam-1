/**
 * Created by macmini on 27/08/2017.
 * by Julian
 */

window.OpenWeather = {
    install: function (Vue, options) {

        var OpenWeather = {
            endpoint: 'http://api.openweathermap.org/data/2.5',
            config: {
                appKey: '',
            }
        };

        // merge configs
        _.merge(OpenWeather.config, options);

        // throw an error if the plug-in is installed without passing an `appKey` option
        if (String(OpenWeather.config.appKey).trim().length === 0) throw new Error('appKey is required.');

        /**
         *  Get weather data
         *
         * @param type
         * @param params
         * @param callback
         * @returns Promise
         */
        OpenWeather.get = function (type, params, callback) {

            // if the second parameter is a function, it is understood that there are no additional params
            // and a callback function was passed instead
            if (typeof params === "function") {
                callback = params;
                params = {};
            }

            // if callback function is not defined set a default value
            callback = callback || function () {};

            // add the key to the params
            params.appid = this.config.appKey;

            // create a deferred object
            var deferred = $.Deferred();


            // store xhrs into an array which will be passed to Promise.all()
            var promises = [
                $.getJSON(this.endpoint + '/' + type, params, callback)
            ];

            // if `zip` is defined in the params, query all local areas found in the specified zip code
            if (params.zip !== undefined) {
                promises.push($.getJSON('http://maps.googleapis.com/maps/api/geocode/json', {address: params.zip}, callback))
            }

            // abort xhrs if the reject() method is called
            deferred.fail(function () {
                _.forEach(promises, function (promise) {
                    promise.abort();
                })
            });

            // use promise all to make sure that all xhrs are done before processing the data
            Promise.all(promises).then(function (values) {

                var response = values[0];

                try {
                    response.cities = values[1].results[0].postcode_localities;
                } catch (e) {}

                deferred.resolve(response);
            }).catch(function (e) {
                deferred.reject(e);
            });

            return deferred;
        };

        // register as an instance property
        Vue.prototype.$weather = OpenWeather;
    }
};