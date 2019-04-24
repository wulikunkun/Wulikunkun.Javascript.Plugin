
//第二代面向对象版本
; (function () {

    //我一开始尝试在这里打个断点进行组件的调试，但是实际上只有在页面加载的时候这里才会执行，而不是针对HTML元素使用组件的时候

    //这里也可以写成 function Search(ele,options)这种形式
    var Search = function (ele, options) {
        this.ele = ele;
        //这里是非常容易混淆的一点，this指的是我们使用Search这个构造函数创建的新对象，而this.ele指的是我们应用这个组件所绑定的那个HTML元素通过jQuery选中之后形成的jQuery对象
        this.defaults = {
            isSearch: false
        };

        this.options = $.extend({}, this.defaults, options);

        this.searchInput = "<div class='searchContainer'><input name='search' type='search' class='searchInput' /><button id='searchButton' class='searchButton'>搜索</button></div>";

        //这表示这个构造函数在执行的时候会执行其原型对象上的init()方法
        this.init();

        //构造函数中的代码应该以分号结尾而不是逗号

    };


    Search.prototype = {
        init: function () {
            this.search();
        },
        search: function () {
            //根据传入的参数设置是否显示为搜索组件
            if (this.options.isSearch) {
                debugger;
                this.ele.addClass("searchComponent");
                this.ele.append(this.searchInput);
            }
        }
    }

    // 这里也可以写成 $.fn["mySearch"]的形式，这都是访问对象属性值的形式，注意使用方括号访问时需要加双引号
    $.fn.mySearch = function (options) {
        debugger;
        //个人认为这里才是调试组件打断点的最佳位置

        var search = new Search(this, options);
        return this;
        // 如果想要实现链式调用，就必须返回这个实例

    }
})(jQuery, window, document);
