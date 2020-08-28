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

    this.$domData = $(this.settings.data);

    this.components = {
      $container: $(
        "<div class='container-fluid'><div class='row' id='container'></div></div>"
      ),
      $leftPanel: $(
        '<div class="col-3 vh-100 overflow-auto position-relative px-0 shadow-sm left-panel custom-scroll"></div>'
      ),
      $leftPanelTopBar: $(
        '<div class="w-100 px-4 text-white py-3 border-bottom border-dark"><i class="fa fa-angle-left" aria-hidden="true"></i><a class="float-right text-light" href="#">返 回</a></div>'
      ),
      $leftPanelCover: $(
        '<img src="' +
          this.settings.coverUrl +
          '" class="w-50 d-block p-2 mx-auto my-2" />'
      ),
      $leftPanelNavContainer: $('<nav class="nav-bar px-4"></nav>'),
      $rightPanel: $(
        '<div class="col-9 bg-light vh-100 overflow-auto position-relative px-5"><div class="card min-vh-100 my-5 rounded-0 p-5 border-0 shadow-sm mx-auto" style="width:210mm;min-width:210mm"></div> </div>'
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

      var $hTagDoms =
        this.$domData.filter("h1,h2,h3,h4,h5,h6").length == 0
          ? this.$domData.find("h1,h2,h3,h4,h5,h6")
          : this.$domData.filter("h1,h2,h3,h4,h5,h6");
      debugger;
      for (var i = 0; i < $hTagDoms.length; i++) {
        var currentItem = $hTagDoms[i],
          $currentItem = $(currentItem);

        /* 给文档中的H标签添加锚点 */
        $currentItem.attr("id", $currentItem.text());

        if (currentItem.tagName == "H1") {
          var $nextLevelItem = $(
            '<a class="nav-link text-white-50 border-top border-dark py-3 text-left px-4 rounded-sm" data-level="1" href="#' +
              $currentItem.text() +
              '">' +
              $currentItem.text() +
              "</a>"
          );
          this.components.$leftPanelNavContainer.append($nextLevelItem);
        } else this.GenerateChildLevel(currentItem);
      }

      /* 向左侧面板添加内容 */
      this.components.$leftPanel
        .append(this.components.$leftPanelTopBar)
        .append(this.components.$leftPanelCover);

      this.components.$leftPanelCover.after(
        this.components.$leftPanelNavContainer
      );

      this.components.$container.children().append(this.components.$leftPanel);

      /* 向右侧面板添加内容 ,初始加载时只显示第一个H1节点及其字节点对应的内容*/
      /* 使用jquery容易弄混子代和同级的查询，下面这行代码实现了一种‘区间查询的效果’ */
      var firstHTag = this.$domData.find("h1").first().prop("outerHTML");
      var $firstHTagContent = this.$domData.find("h1").first().nextUntil("h1");
      var firstHTagContentString = "";

      /*一个常见的问题，在对一个jquery对象集合 进行遍历时，遍历的单个元素需要使用$包裹 */
      for (var i = 0; i < $firstHTagContent.length; i++) {
        firstHTagContentString += $($firstHTagContent[i]).prop("outerHTML");
      }
      /* 在没有添加到dom之前，貌似不可以对其调用after方法 */
      // var $firstHTagTotalContent = $firstHTag.after($firstHTagContent);

      var firstHTagTotalContent = firstHTag + firstHTagContentString;

      this.components.$rightPanel.find("div.card").html(firstHTagTotalContent);
      this.components.$container.children().append(this.components.$rightPanel);
      this.$ele.append(this.components.$container);
    },
    initEvents: function () {
      this.components.$leftPanelNavContainer
        .children()
        .on("click", $.proxy(this.showOrHideChildLevel, this));

      this.components.$leftPanelNavContainer
        .find("a")
        .on("click", $.proxy(this.showLevelContent, this));
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
        '<a class="nav-link text-white-50 custom-border-dark py-2 text-left px-4 small rounded-sm" href="#' +
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
        var $nextLevelContainer = $(
          "<div class='rounded-sm' style='background:rgb(33, 31, 31)'></div>"
        );
        $nextLevelContainer.append($nextLevelItem);
        $nextLevelContainer.hide();
        $parentLevel.after($nextLevelContainer);
      } else {
        $parentLevel.next().append($nextLevelItem);
      }
    },

    /* 在左侧导航栏点击不同的一级链接时在右侧只显示该一级标题下的内容 */
    showLevelContent: function (e) {
      var $targetLevel = $(e.target);
      var level = $targetLevel.data("level");
      if (level == 1) {
        var firstLevelTitle = $targetLevel.text().trim();
        var $firstLevelItem = this.$domData.find(
          "h1:contains(" + firstLevelTitle + ")"
        );

        var firstHTag = $firstLevelItem.prop("outerHTML");
        var $firstHTagContent = $firstLevelItem.nextUntil("h1");
        var firstHTagContentString = "";
        for (var i = 0; i < $firstHTagContent.length; i++) {
          firstHTagContentString += $($firstHTagContent[i]).prop("outerHTML");
        }
        var firstHTagTotalContent = firstHTag + firstHTagContentString;

        this.components.$rightPanel
          .find("div.card")
          .html(firstHTagTotalContent);
      }
    },
  };

  $.fn.Reader = function (options) {
    return this.each(function () {
      new Reader(this, options);
    });
  };
})(jQuery, document, window);
