(function (jQuery, window, document, undefined) {
  function Reader(ele, options) {
    this.$ele = $(ele);

    this.defaults = {
      data: "",
      width: "15%",
      height: "100%",
      coverUrl: "",
    };

    this.settings = $.extend({}, this.defaults, options);

    this.components = {
      $container: $(
        "<div class='container-fluid'><div class='row' id='container'></div></div>"
      ),
      $panel: $(
        '<div class="col-3 vh-100 overflow-auto position-relative px-0 shadow-sm" style="background-color: #333;"></div>'
      ),
      $panelTopBar: $(
        '<div class="w-100 px-4 text-white py-3 border-bottom border-dark"><i class="fa fa-angle-left" aria-hidden="true"></i><a class="float-right text-light font-weight-bold" href="#">返 回</a></div>'
      ),
      $panelCover: $(
        '<img src="' +
          this.settings.coverUrl +
          '" class="w-50 d-block p-2 mx-auto my-2" />'
      ),
    };

    this.init();
  }

  Reader.prototype = {
    init: function () {
      this.initStyle();
      this.initEvents();
    },
    initStyle: function () {
      /* js文件在哪个页面中执行资源路径就相对于哪个页面 */
      $("head").append(
        "<link href='./content/css/reader.css' rel='stylesheet'/>"
      );
      $("head").append(
        "<link href='./content/css/bootstrap.min.css' rel='stylesheet'/>"
      );
      $("head").append(
        "<link href='./content/css/fontawesome.min.css' rel='stylesheet'/>"
      );

      this.components.$panel
        .append(this.components.$panelTopBar)
        .append(this.components.$panelCover);

      this.components.$container.append(this.components.$panel);

      this.$ele.append(this.components.$container);
    },
    initEvents: function () {},
  };

  $.fn.Reader = function (options) {
    return this.each(function () {
      new Reader(this, options);
    });
  };
})(jQuery, document, window);

// Author info:Wang Kun
// Date: 2019-12-10-13-33-04
// Dependency: jQuery 1.7.1
// Parameters:
// 1. maxHeight:设置下拉框的最大高度，可以用于对齐
// 2. data:传入的下拉选项的字符串数组
// 3. defaultIndex: 默认要显示数组中的哪一项，索引从0开始，表示第一项
