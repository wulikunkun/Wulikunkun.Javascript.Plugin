// 第一代初始版本
$.fn.myFirstPlugin = function (options) {
    debugger;
    var defaults = {
        fontsize: "14px",
        color: "blue",
        background: "yellow"
    };

    //一定要注意这里对于插件的默认配置defaults的保护，为了保证默认值不被修改同时用户传进来的配置一样能够生效，我们将这里的extend 方法的第一个参数设置成一个空对象

    var settings = $.extend({}, defaults, options);

    //这里需要注意css的参数是类似于Json数据那样的形式。

    this.css({
        "fontSize": settings.fontsize,

        //这里需要注意的是在通过jQuery的css方法设置类似于fontSize这样的属性时，既可以通过fontSize这样的写法，也可以通过和设置普通的css一样的写法，也就是font-size，还有就是这里的font-size既可以设置成数字，也可以设置成字符串'14px'。

        "color": settings.color,
        "background": settings.background
    });

    var hrefInfo = this.attr("href");

    //为了能够支持jQuery的链式调用，这里需要return一下。
    this.append(hrefInfo);

    return this;

    //为了支持链式调用，我们即可以使用return this这样的写法，也可以使用return this.append(hrefinfo)，两者都是一样的。
}