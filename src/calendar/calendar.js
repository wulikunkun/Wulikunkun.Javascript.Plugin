; (function () {

    function Calendar(ele, options) {
        this.$ele = ele;
        this.defaults = {

        };
        this.components = {
            container: '<div class="menu_container"></div>',
            item: '<div class="menu_item"></div>'
        };
        this.data = ["Tab1", "Tab2", "Tab3"];
        this.options = $.extend({}, this.defaults, options);
        this.init();
    }

    Calendar.prototype = {
        init: function () {
            this.initEvent();
        },
        initEvent: function () {
            // 注意这里和下面的proxy方法的使用方式
            this.$ele.on("click", $.proxy(this.display, this));
            // this.$ele.on("click", function () {
            //     debugger;
            // $(this).val('123');
            // $(this).css({ "textAlign": "center", "fontWeight": "bold" })
            // });
        },
        display: function (e) {
            var $this = $(e.target);

        }
    }

    $.fn.MyCalendar = function (options) {
        var calendar = new Calendar(this, options);
        return this;
    }

})(jQuery, document, window);