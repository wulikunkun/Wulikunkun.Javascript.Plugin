
; (function (jQuery, window, document, undefined) {

    function Datepicker(ele, options) {
        this.$ele = $(ele);
        this.defaults = {};
        this.settings = $.extend({}, this.defaults, options);
        this.components = {
            parentContainer: this.$ele.parent(),
            datePanel: $("<div class='date_panel' style='width:250%;height:250px;position:absolute;display:none;top:33px;border-radius:2px'></div>"),
            dateValueInput: $("<input placeholder='请选择日期' style='outline:none;height:23px;width:200px;margin-top:5px;border-radius:3px;border:1px solid lightgray;padding:0 1%;display:inline-block;vertical-align:bottom'/>"),
            quickSelect: $("<select style='height:24px;border-radius:3px;border:1px solid lightgray;margin-left:2%;appearance:none'><option value='快速选择'>快速选择</option><option value='近三天'>近三天</option><option value='近一个周'>近一个周</option><option value='近一个月'>近一个月</option><option value='近三个月'>近三个月</option><option value='近半年'>近半年</option><option value='近一年'>近一年</option></select>"),
            submitButton: $("<button style='width: 50px;height:24px;border-radius:3px;border:1px solid lightgray;margin-left:2%;cursor:pointer'>确认</button>"),
            cancelButton: $("<button style='width: 50px;height:24px;border-radius:3px;border:1px solid lightgray;margin-left:2%;cursor:pointer'>取消</button>"),
            
        };
        this.init();
    };

    Datepicker.prototype = {
        init: function () {
            this.initStyle();
            this.initEvents();
        },
        initStyle: function () {

            this.$ele.css({
                "border-radius": "3px",
                "border": "1px solid #dddfe1",
                "height": "28px",
                "padding": "0 2px",
                "box- shadow": "inset 0px 0px 0.8px grey",
                "outline": "none",
                "cursor": "pointer",
                "display": "inline-block",
                "width": "180px"
            });

            this.components.parentContainer.css({
                "position": "relative",
                "display": "inline-block"
            });

            this.components.datePanel.append(this.components.dateValueInput);
            this.components.datePanel.append(this.components.quickSelect);
            this.components.datePanel.append(this.components.submitButton);
            this.components.datePanel.append(this.components.cancelButton);
            this.$ele.after(this.components.datePanel);
        },
        initEvents: function () {
            this.$ele.focus($.proxy(this.showDatePanel, this));
            this.$ele.blur($.proxy(this.hideDatePanel, this));

            // 调整样式临时代码
            $(".date_panel").on("click", function () {
                debugger;
                $(this).prev().unbind("blur");
            });
        },
        showDatePanel: function (e) {
            this.components.datePanel.fadeIn(300);
        },
        hideDatePanel: function (e) {
            this.components.datePanel.fadeOut(100);
        }
    }

    $.fn.myDatepicker = function (options) {
        return this.each(function () {
            new Datepicker(this, options);
        })
    };
})(jQuery, document, window)