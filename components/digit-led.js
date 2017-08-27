/**
 * Created by macmini on 27/08/2017.
 * by Julian
 */

window.DigitLed = {
    template: '<div class="digit" v-if="digits[value] !== undefined">'
    + '<template v-for="y in resolution[1]">'
    + '<div class="bitbtn circle" v-for="x in resolution[0]" :ref="pointPrefix + getPoint(x,y)" :class="{on: isPointActive(x, y)}"></div>'
    + '</template>'
    + '</div>',
    props: ['value'],
    data: function () {
        return {
            resolution: [5,7], // the number of columns and rows
            digits: {
                // map the points that will be set to active for each digit
                0: [1,2,3,5,9,10,14,15,19,20,24,31,32,33,29,25],
                1: [2,1,5,7,12,17,22,31,32,33,27],
                2: [1,2,3,5,9,13,17,21,25,30,31,32,33,34],
                3: [1,2,3,5,9,14,18,17,24,29,33,32,31,25],
                4: [2,6,10,15,16,17,18,19,8,13,23,28,33],
                5: [0,1,2,3,4,5,10,15,16,17,18,24,29,33,32,31,25],
                6: [1,2,3,5,9,10,15,20,25,31,32,33,29,24,18,17,16],
                7: [5,1,2,3,4,9,14,18,22,26,31],
                8: [1,2,3,5,9,10,14,20,24,31,32,33,29,25,16,17,18],
                9: [1,2,3,5,9,10,14,19,24,29,33,32,31,25,16,17,18]
            },
            pointPrefix: 'point-', // used for referencing the DOM Element for each point
            pointHeight: 15,
            pointWidth: 15,
            verticalGutter: 5, // vertical spacing in pixels between each points
            horizontalGutter: 5 // horizontal spacing in pixels between each points
        }
    },
    mounted: function () {

        // when the component is mounted, immediately render the contents
        this.update();

    },
    watch: {
        value: function () {

            // when the value is changed, re-render the contents based on the new value
            this.update();

        }
    },
    methods: {
        update: function () {

            for (var y = 1; y <= this.resolution[1]; y++) {
                for (var x = 1; x <= this.resolution[0]; x++) {

                    // wrap the element in jQuery for easy manipulation
                    var $point = $(this.$refs[this.pointPrefix + this.getPoint(x, y)]);

                    // set the position of the element
                    $point.css({
                        top     : (y-1) * (this.pointHeight + this.verticalGutter),
                        left    : (x-1) * (this.pointWidth + this.horizontalGutter),
                        height  : this.pointHeight,
                        width   : this.pointWidth
                    });

                }
            }

            // update the height and width of the parent element to fit the sum of the height and width of each row and column
            $(this.$el)
                .height(this.resolution[1] * (this.pointHeight + this.verticalGutter))
                .width(this.resolution[0] * (this.pointWidth + this.horizontalGutter));

        },
        getPoint: function (x, y) {

            // get the point assigned for target x and y coordinate
            return ((y-1) * this.resolution[0]) + x-1;

        },

        isPointActive: function (x, y) {

            // check if the target x and y coordinate is an active point
            return this.digits[this.value].indexOf(this.getPoint(x,y)) !== -1;

        }
    }
};
