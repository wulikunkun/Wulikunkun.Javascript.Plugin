; (function (jQuery, document, window, undefined) {

    function Dropdown(ele, options) {
        this.$ele = $(ele);
        this.defaults = {
            title: "请进行选择",
            data: [
                { "Id": "1", "Text": "选项一", "Value": "选项一" },
                { "Id": "2", "Text": "选项二", "Value": "选项二" },
                { "Id": "3", "Text": "选项三", "Value": "选项三" }
            ],
            height: "auto",
            width: 120
        };
        this.components = {
            input_out_container: '<div class="input_out_container"></div>',
            dropdown_container: '<div class="dropdown_container"></div>',
            item: '<div class="dropdown_item"></div>',
            arrow: '<i class="fas fa-chevron-down" style="cursor:pointer"></i>'
        };

        //entend将这里defaults对象和options对象中的所有键值合并到一个对象中，如果他们两者中包含重名的键名，则由后面的属性值覆盖前面的属性值
        this.options = $.extend({}, this.defaults, options);
        this.init();
    }

    Dropdown.prototype = {
        init: function () {
            //这里初始化样式一定要在初始化绑定事件的前面，否则绑定事件容易出现问题
            this.initStyle();
            this.loadData();
            this.initEvent();
        },
        initStyle: function (e) {

            //#region 动态设置所绑定插件的元素的样式
            debugger;
            this.$ele.addClass("input_container");
            this.$ele.val(this.options.title);
            this.$ele.css({ "width": this.options.width });

            //#endregion

            //#region 给input元素设置包裹元素

            // 首先获取input元素原来的父元素，我们给input元素设置包裹元素之后仍然需要将这个包裹元素添加到input元素原来的父元素中
            var $initialParent = this.$ele.parent();
            $initialParent.css("position", "relative");
            //我在创建input的包裹元素时犯了一个错误，input外面的这个包裹元素是动态生成的，尽管将input元素添加到了这个动态生成的包裹元素中，但是这个包裹元素还没有添加到DOM树中，因此会导致添加之后不会显示
            var $input_out_container = $(this.components.input_out_container);

            //这里的这个inline-block必须这样写，不可以写成驼峰式，否则该样式不会生效，建议以后通过jquery的css方法设置样式时属性名和属性值都写成与标准CSS一直的格式
            $input_out_container.css({
                "display": "inline-block",
                "position": "absolute",
                "width": this.options.width + 11,
                "height": "300"
            });
            debugger;
            $input_out_container.append(this.$ele);
            $initialParent.append($input_out_container);
            //#endregion

            //#region 获取input元素的宽度和高度并对渐现的下拉列表进行设置
            this.$ele.parent().append(this.components.dropdown_container);
            var inputWidth = this.$ele.width();
            this.$ele.parent().find(".dropdown_container").css({
                "width": inputWidth + 10.5,
                "height": this.options.height,
                "margin-left": ".5px",
                "z-index": 10000,
                "position": "absolute"
            });
            //#endregion

            //#region  加载下拉三角到input元素里面

            //正确的写法
            var arrow = $(this.components.arrow);
            arrow.css({
                "position": "absolute",
                "right": "5px",
                "top": "7px",
                "color": "#7030A0"
            });
            $input_out_container.append(arrow);


            //错误的写法

            //我一直都认为这种写法是可以产生效果的，但是经过我在浏览器中的检查元素之后发现这里的样式就是无法应用到i元素上面，这里和上面的区别就在于我先将i元素保存到了一个arrow变量里面

            // $(this.components.arrow).css({
            //     "position": "absolute",
            //     "right": "5px",
            //     "top": "4px"
            // });
            // $input_out_container.append($(this.components.arrow));

            //#endregion
        },
        initEvent: function () {

            //注意这里的$.proxy的用法，我在这里尝试用this.showDropdown作为click的参数，但是并没有成功，看来在涉及到触发事件的操作时还是需要用proxy啊
            this.$ele.focus($.proxy(this.showDropdown, this));
            this.$ele.blur($.proxy(this.hideDropdown, this));

            //正确的写法
            this.$ele.focus($.proxy(this.changeBorderRadius, this));
            //错误的写法
            // this.$ele.focus(this.$ele.toggleClass("input_radius"));

            // 正确的写法
            this.$ele.blur($.proxy(this.changeBorderRadius, this));
            //错误的写法
            // this.$ele.blur(this.$ele.toggleClass("input_radius"));

            this.$ele.parent().find(".fas").on("click", $.proxy(this.changeDirectionOfArrow, this));

            //在页面其它地方点击的时候隐藏dropdown
            $(document).click($.proxy(this.hideDropdownAtOtherPlace, this));

            //#region 选中一项给input赋值
            this.$ele.next(".dropdown_container").find(".dropdown_item").on("click", $.proxy(this.setInputValue, this));
            //#endregion
        },
        showDropdown: function (e) {
            var $this = $(e.target);
            $this.next(".dropdown_container").fadeIn(600);
            $this.parent().find(".fas").toggleClass("fa-chevron-up fa-chevron-down");
        },
        hideDropdown: function (e) {
            var $this = $(e.target);
            $this.next(".dropdown_container").fadeOut(100);
            $this.parent().find(".fas").toggleClass("fa-chevron-up fa-chevron-down");
        },
        hideDropdownAtOtherPlace: function (e) {

            //这里解释一下为什么不在initEvents里面写这个时间处理程序，如果在initEvents里面写这个事件处理程序，那么就无法再事件处理程序中通过this访问到我们绑定插件的这个元素，因为如果那样写的话this指向的是触发事件的元素，因此在这里是通过initEvents中使用了一个代理指向了hideDropdownAtOtherPlace()这个事件处理程序

            var $target = $(e.target);
            if (!$target.is(".fas") && !$target.is(".input_container")) {

                // 注意这里设置一个或者多个css属性的值可以使用css方法，添加或者或者删除一个元素的某一个或者多个class可以使用addClass或者removeClass方法，而如果要将一个元素原来所有的class进行替换可以使用这里的attr方法
                this.$ele.parent().find(".fas").attr("class", "fas fa-chevron-down");
                this.$ele.parent().find(".dropdown_container").fadeOut(100);
            }
        },
        changeBorderRadius: function (e) {
            var $this = $(e.target);
            $this.toggleClass("input_radius");
        },
        loadData: function (e) {
            var data = this.options.data;

            // js中没有foreach语句
            data.forEach(item => {
                var $selectItem = $(this.components.item).text(item.Text);
                this.$ele.next(".dropdown_container").append($selectItem);
            });
        },
        changeDirectionOfArrow: function (e) {
            var $this = $(e.target);
            $this.toggleClass("fa-chevron-up fa-chevron-down");
            var dropdownState = $this.prev(".dropdown_container").css("display");
            if (dropdownState == "none") {
                $this.prev(".dropdown_container").fadeIn();
            }
            else {
                $this.prev(".dropdown_container").fadeOut(100);
            }
        },
        setInputValue: function (e) {
            var $this = $(e.target);
            this.$ele.val($this.text());
        }
    }

    //正确的写法
    $.fn.MyDropdown = function (options) {
        return this.each(function () {
            new Dropdown(this, options);
        });
    };

    //错误的写法,如果这样写，那么在页面中我们使用插件时如果使用的选择器选择了多个元素就无法再每一个元素上应用该插件
    // $.fn.MyDropdown = function (options) {
    //     var calendar = new Dropdown(this, options);
    //     return this;
    // }

})(jQuery, document, window);