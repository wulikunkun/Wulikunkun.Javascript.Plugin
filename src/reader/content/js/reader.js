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
        "<div class='container-fluid px-0'><div class='row' id='container'></div></div>"
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
      $panelNavContainer: $('<nav class="nav-bar"></nav>'),
      $firstLevel: $(
        '<a class="nav-link text-white-50 border-top border-dark py-3 font-weight-bold text-right px-4" href="#"></a>'
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
        "<link href='./content/css/fontawesome-free-5.13.0-web/css/all.css' rel='stylesheet'/>"
      );

      /* 倒序加载DOM */
      var $dataDom = $(this.settings.data);
      for (var i = 0; i < $dataDom.length; i++) {
        var currentItem = $dataDom[i];
        if (currentItem.tagName == "H1") {
          var $nextLevelItem = $(
            '<a class="nav-link text-light border-top border-dark py-3 font-weight-bold text-left px-4" href="#" data-level="1">' +
              $(currentItem).text() +
              "</a>"
          );
          this.components.$panelNavContainer.append($nextLevelItem);
        } else this.GenerateChildLevel(currentItem);
      }

      this.components.$panel
        .append(this.components.$panelTopBar)
        .append(this.components.$panelCover);

      this.components.$panelCover.after(this.components.$panelNavContainer);

      this.components.$container.append(this.components.$panel);

      this.$ele.append(this.components.$container);
    },
    initEvents: function () {
      this.components.$panelNavContainer
        .children()
        .on("click", $.proxy(this.showChildrenLevel, this));
    },
    showChildrenLevel: function (e) {
      var $currentTarget = $(e.target);
      $currentTarget.next().slideDown();
    },
    hideChildrenLevel: function () {},
    GenerateChildLevel: function (tagItem) {
      debugger;

      var nextLevelNum = tagItem.tagName[1],
        parentLevelNum = nextLevelNum - 1;

      var $nextLevelItem = $(
        '<a class="nav-link text-white-50 border-top border-dark py-1 font-weight-bold text-left px-4 small" href="#" data-level="' +
          nextLevelNum +
          '">' +
          "&nbsp;&nbsp;" +
          $(tagItem).text() +
          "</a>"
      );

      /* last是对当前选择器选中的dom集合进行过滤，而不是从当前jquery对象的子元素中进行过滤 */

      var $parentLevel = null;
      if (parentLevelNum == 1) {
        $parentLevel = this.components.$panelNavContainer
          .children("a[data-level='" + parentLevelNum + "']")
          .last();
      } else {
        $parentLevel = this.components.$panelNavContainer
          .find("a[data-level='" + parentLevelNum + "']")
          .last();
      }

      if ($parentLevel.children("i").length == 0) {
        $parentLevel.append(
          '&nbsp;&nbsp;<i class="fa fa-angle-right text-white-50" aria-hidden="true"></i>'
        );
        var $nextLevelContainer = $("<div></div>");
        $nextLevelContainer.append($nextLevelItem);
        $nextLevelContainer.hide();
        $parentLevel.after($nextLevelContainer);
      } else {
        $parentLevel.next().append($nextLevelItem);
      }
    },
  };

  $.fn.Reader = function (options) {
    return this.each(function () {
      new Reader(this, options);
    });
  };
})(jQuery, document, window);
