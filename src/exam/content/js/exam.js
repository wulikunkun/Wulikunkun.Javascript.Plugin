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
      $leftPanel: $(
        '<div class="col-3 vh-100 overflow-auto position-relative px-0 shadow-sm" style="background-color: #333;"></div>'
      ),
      $leftPanelTopBar: $(
        '<div class="w-100 px-4 text-white py-3 border-bottom border-dark"><i class="fa fa-angle-left" aria-hidden="true"></i><a class="float-right text-light font-weight-bold" href="#">返 回</a></div>'
      ),
      $leftPanelCover: $(
        '<img src="' +
          this.settings.coverUrl +
          '" class="w-50 d-block p-2 mx-auto my-2" />'
      ),
      $leftPanelNavContainer: $('<nav class="nav-bar"></nav>'),
      $rightPanel: $(
        '<div class="col-9 bg-light vh-100 overflow-auto position-relative px-5"><div class="card min-vh-100 rounded-0 border-0 shadow-sm mx-auto" style="width:210mm;min-width:210mm"></div> </div>'
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
      var $hTagDoms = $dataDom.filter("h1,h2,h3,h4,h5,h6");

      for (var i = 0; i < $hTagDoms.length; i++) {
        debugger;
        var currentItem = $hTagDoms[i],
          $currentItem = $(currentItem);
        $currentItem.attr("id", $currentItem.text());
        if (currentItem.tagName == "H1") {
          var $nextLevelItem = $(
            '<a class="nav-link text-light border-top border-dark py-3 font-weight-bold text-left px-4" data-level="1" href="#' +
              $currentItem.text() +
              '">' +
              $currentItem.text() +
              "</a>"
          );
          this.components.$leftPanelNavContainer.append($nextLevelItem);
        } else this.GenerateChildLevel(currentItem);
      }

      this.components.$leftPanel
        .append(this.components.$leftPanelTopBar)
        .append(this.components.$leftPanelCover);

      this.components.$rightPanel.find("div.card").html($dataDom);

      this.components.$leftPanelCover.after(
        this.components.$leftPanelNavContainer
      );

      this.components.$container.children().append(this.components.$leftPanel);
      this.components.$container.children().append(this.components.$rightPanel);

      this.$ele.append(this.components.$container);
    },
    initEvents: function () {
      this.components.$leftPanelNavContainer
        .children()
        .on("click", $.proxy(this.showOrHideChildLevel, this));
    },
    showOrHideChildLevel: function (e) {
      var $currentLevel = $(e.target);
      $currentLevel.children("i").toggleClass("fa-angle-right fa-angle-down");

      // this.components.$rightPanel
      //   .find("iframe")
      //   .attr("src", "./" + $currentLevel.text().trim() + ".html");

      if ($currentLevel.attr("isshow") == "true") {
        this.hideChildrenLevel($currentLevel);
      } else {
        this.showChildrenLevel($currentLevel);
      }
    },
    showChildrenLevel: function (selectedLevel) {
      var $selectedLevel = selectedLevel;
      $selectedLevel.attr("isshow", "true");
      $selectedLevel.next().slideDown();
    },
    hideChildrenLevel: function (selectedLevel) {
      var $selectedLevel = selectedLevel;
      $selectedLevel.attr("isshow", "false");
      $selectedLevel.next("div").slideUp();
    },
    GenerateChildLevel: function (tagItem) {
      var nextLevelNum = tagItem.tagName[1],
        parentLevelNum = nextLevelNum - 1;

      var $nextLevelItem = $(
        '<a class="nav-link text-white-50 border-top border-dark py-2 font-weight-bold text-left px-4 small" href="#' +
          $(tagItem).text() +
          '" data-level="' +
          nextLevelNum +
          '">' +
          "&nbsp;&nbsp;".repeat(parentLevelNum) +
          $(tagItem).text() +
          "</a>"
      );

      /* last是对当前选择器选中的dom集合进行过滤，而不是从当前jquery对象的子元素中进行过滤 */

      var $parentLevel = null;
      if (parentLevelNum == 1) {
        $parentLevel = this.components.$leftPanelNavContainer
          .children("a[data-level='" + parentLevelNum + "']")
          .last();
      } else {
        $parentLevel = this.components.$leftPanelNavContainer
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
