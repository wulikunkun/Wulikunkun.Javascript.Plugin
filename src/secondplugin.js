$.fn.mySecondPlugin = function () {
    //为了能够支持jQuery的链式调用，这里需要return一下
    return this.css("fontStyle", "italic");
}