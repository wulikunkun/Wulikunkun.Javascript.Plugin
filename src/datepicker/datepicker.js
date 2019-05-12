
; (function (jQuery, window, document, undefined) {

    function Datepicker(ele, options) {
        this.$ele = $(ele);
        this.defaults = {};
        this.settings = $.extend({}, this.defaults, options);
        this.components = {
            parentContainer: this.$ele.parent(),
            datePanel: $("<div class='date_panel' style='box-shadow: 0px 0px 8px lightgrey;box-shadow: 5px lightblue;width: 250%;height: 300px;position: absolute;top: 33px;border-radius: 2px;padding:3px 5px'></div>"),
            dateValueInput: $("<input placeholder='请选择日期' style='outline:none;height:23px;width:200px;margin-top:5px;border-radius:3px;border:1px solid lightgray;padding:0 1%;display:inline-block;vertical-align:bottom'/>"),
            quickSelect: $("<select style='height:24px;border-radius:3px;border:1px solid lightgray;margin-left:2%;appearance:none'><option value='快速选择'>快速选择</option><option value='近三天'>近三天</option><option value='近一个周'>近一个周</option><option value='近一个月'>近一个月</option><option value='近三个月'>近三个月</option><option value='近半年'>近半年</option><option value='近一年'>近一年</option></select>"),
            submitButton: $("<button style='width: 50px;height:24px;border-radius:3px;border:none;color:white;margin-left:2%;cursor:pointer;background: #2892ed'>确认</button>"),
            cancelButton: $("<button style='width: 50px;height:24px;border-radius:3px;border:none;color:white;margin-left:2%;cursor:pointer;background: #2892ed'>取消</button>"),
            dateTitle: $("<div style='margin-top:20px;margin-bottom:10px;text-align:center'><i class='fas fa-angle-double-left' style='color:#2892ed;float:left;margin-left:3%;cursor:pointer'></i><i class='fas fa-angle-left' style='color:#2892ed;margin-left:3%;cursor:pointer;float:left'></i><span class='date_title' style='font-size:13.5px;font-weight:bold'></span><i class='fas fa-angle-double-right' style='float:right;color:#2892ed;margin-right:3%;cursor:pointer'></i><i class='fas fa-angle-right' style='float:right;cursor:pointer;color:#2892ed;margin-right:3%'></i></div>"),
            dateContent: $("<div class='date_content'><table style='width:100%'><thead style='font-size:13.5px'><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead><tbody></tbody></table></div>")
        };
        this.init();
    };

    Datepicker.prototype = {
        init: function () {
            this.initStyle();
            this.initEvents();
            this.initialDate();
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
                "width": "160px"
            });

            this.components.parentContainer.css({
                "position": "relative",
                "display": "inline-block"
            });

            this.components.datePanel.append(this.components.dateValueInput);
            this.components.datePanel.append(this.components.quickSelect);
            this.components.datePanel.append(this.components.submitButton);
            this.components.datePanel.append(this.components.cancelButton);
            this.components.datePanel.append(this.components.dateTitle);
            this.components.datePanel.append(this.components.dateContent);
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
        },
        initialDate: function (e) {
            var $dateTitleBox = this.components.dateTitle.find(".date_title");
            var date = new Date();
            var currentYear = date.getFullYear();
            var currentMonth = date.getMonth() + 1;
            $dateTitleBox.text(currentYear.toString() + "年" + currentMonth.toString() + "月");
        }
    }

    $.fn.myDatepicker = function (options) {
        return this.each(function () {
            new Datepicker(this, options);
        })
    };
})(jQuery, document, window)