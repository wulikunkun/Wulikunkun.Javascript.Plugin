; (function (jQuery, document, window, undefined) {

    function Carousel(ele, options) {
        this.$ele = $(ele);
        this.defaults = {
            duration: 2000
        };
        this.components = {
            $scrollContainer: $("<div class='scroll_container'></div>"),
            $leftArrow: $("<i class='fas fa-chevron-left' style='left:20px;color:lightgray'></i>"),
            $rightArrow: $("<i class='fas fa-chevron-right' style='right:20px;color:lightgray'></i>"),
            $dotContainer: $("<div class='dot_container' style='position:absolute;top:85%;left:50%;font-size:10px;width:200px;margin-left:-100px'></div>"),
            // 错误的写法
            // $dot: $("<i class='fas fa-circle' style='color:lightgray;margin-left:5px'></i>")
            //正确的写法
            $dot: "<i class='fas fa-circle' style='color:lightgray;margin-left:5px;cursor:pointer'></i>"

        };
        this.settings = $.extend({}, this.defaults, options);
        this.init();
    };

    Carousel.prototype = {
        init: function () {
            this.initStyle();
            this.initEvents();
        },
        initStyle: function () {

            this.$ele.css({
                "position": "relative",
                "overflow": "hidden",
                // $(window).outerWidth()可以获取包含滚动条在内的视口宽度
                "width": $(window).outerWidth()
            });

            this.$ele.children("img").css({
                "float": "left",
                "display": "inline-block",
                "width": this.$ele.width()
            })


            for (var i = 1; i <= this.$ele.children("img").length; i++) {
                this.components.$dotContainer.append(this.components.$dot);
            }

            // 上面那种写法和这里其实是一样的
            // this.$ele.forEach(function () {
            // });

            this.components.$scrollContainer.append(this.$ele.children("img"));
            this.components.$scrollContainer.css({
                "position": "absolute",
                "width": this.$ele.width() * this.components.$scrollContainer.children("img").length,
            });

            this.components.$scrollContainer.appendTo(this.$ele);

            this.$ele.append(this.components.$leftArrow, this.components.$rightArrow);

            //这里这个$dotContainer元素一定要放在最后面添加
            this.$ele.append(this.components.$dotContainer);

            var innerHeight = this.$ele.find(".scroll_container").height();
            this.$ele.height(innerHeight);
        },
        initEvents: function () {

            //#region 页面一加载就开始滚动
            setInterval(() => {
                var movedDistance = parseInt(this.components.$scrollContainer.css("left"));
                var everyMoveDistance = this.$ele.width();
                var index = -(movedDistance / everyMoveDistance);
                var maxIndex = this.components.$scrollContainer.find("img").length - 1;
                if (index < maxIndex) {
                    var leftOffset = -(index + 1) * everyMoveDistance;
                    this.components.$scrollContainer.animate({ "left": leftOffset });

                    // 如果想让jQuery的animate方法每次点击向左或者向右移动一定的距离，可以这样写(注意这里的加等和减等)：
                    // this.components.$scrollContainer.animate({ "left": "-=200px" });
                    // this.components.$scrollContainer.animate({ "left": "+=200px" });

                }
                else {
                    this.components.$scrollContainer.css("left", "0px");
                }

            }, this.settings.duration);

            //#endregion

            //#region 绑定各种事件

            // 我并没有找到特别合适的悬停显示和移出隐藏事件，我不知道为什么使用mouseover事件总是出问题，所以在这里使用了这个hover事件，hover的第一个参数表示移动上去执行的函数，第二个表示移出执行的函数
            this.$ele.hover($.proxy(this.showArrow, this), $.proxy(this.hideArrow, this));

            this.components.$leftArrow.on("click", $.proxy(this.moveLeft, this));
            this.components.$rightArrow.on("click", $.proxy(this.moveRight, this));

            this.$ele.find(".fas.fa-circle").click($.proxy(this.moveByDot, this));

            this.$ele.find(".fa-chevron-left").click($.proxy(this.moveLeft, this));
            this.$ele.find(".fa-chevron-right").click($.proxy(this.moveRight, this));

            $(window).resize($.proxy(this.resizeByWindow, this));
            //#endregion
        },
        showArrow: function (e) {
            //如果给fadeIn和fadeOut加上参数表示的并不是多少秒之后淡出或者淡入，而是表示淡入淡出的效果持续的时间段，在这个时间段之后元素将恢复原来的显示状态
            this.components.$leftArrow.fadeIn();
            this.components.$rightArrow.fadeIn();
        },
        hideArrow: function (e) {
            this.components.$leftArrow.fadeOut();
            this.components.$rightArrow.fadeOut();
        },
        moveLeft: function (e) {
            debugger;
            //根据偏移的总距离和每次偏移的距离之商求出当前图片的索引值
            var leftOffset = parseInt(this.components.$scrollContainer.css("left"));
            var everyMoveDistance = this.$ele.width();
            //可以放心的使用这种写法将负数转为正数
            var index = -(leftOffset / everyMoveDistance);
            var maxIndex = this.$ele.find("img").length - 1;
            if (index < maxIndex) {
                var moveDistance = -(index + 1) * everyMoveDistance;
                this.components.$scrollContainer.animate({ "left": moveDistance });
            }
            else {
                this.components.$scrollContainer.animate({ "left": "0" });
            }
        },
        moveRight: function (e) {
            debugger;
            //根据偏移的总距离和每次偏移的距离之商求出当前图片的索引值
            var leftOffset = parseInt(this.components.$scrollContainer.css("left"));
            var everyMoveDistance = this.$ele.width();
            //可以放心的使用这种写法将负数转为正数
            var index = -(leftOffset / everyMoveDistance);
            if (index != 0) {
                var moveDistance = -(index - 1) * everyMoveDistance;
                this.components.$scrollContainer.animate({ "left": moveDistance });
            }
            else {
                this.components.$scrollContainer.animate({ "left": "0" });
            }
        },
        moveByDot: function (e) {
            var targetDotIndex = $(e.target).index();
            //通过jQuery的index方法获取一个元素在多个类似兄弟元素中的索引值
            var distance = this.$ele.width() * targetDotIndex;
            this.components.$scrollContainer.animate({ "left": -distance });
        },
        resizeByWindow: function (e) {
            debugger;
            this.initStyle();
            // this.$ele.width($(window).outerWidth());
        }

    };

    $.fn.myCarousel = function (options) {
        return this.each(function () {
            new Carousel(this, options);
        })
    };

})(jQuery, document, window);