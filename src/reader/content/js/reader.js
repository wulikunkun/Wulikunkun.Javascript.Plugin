(function (jQuery, window, document, undefined) {
  function Reader(ele, options) {
    this.$ele = $(ele);

    this.defaults = {
      data: "",
      coverUrl: "",
    };

    this.settings = $.extend({}, this.defaults, options);

    /* 考虑到用户编写的内容中可能并没有父级标签包裹标题标签，所以在此手动使用div进行强制包裹 */
    this.$domData = $("<div>" + this.settings.data + "</div>");

    this.components = {
      $container: $(
        "<div class='container-fluid'><div class='row' id='container'></div></div>"
      ),
      $leftPanel: $(
        '<div class="col-3 vh-100 overflow-auto position-relative px-2 left-panel custom-scroll custom-font"></div>'
      ),
      $leftPanelTopBar: $(
        '<div class="w-100 px-2 text-muted py-2 border-bottom border-light"><i class="fa fa-angle-left text-black-50" aria-hidden="true"></i><a class="float-right text-black-50 small" href="#">返 回</a></div>'
      ),
      $leftPanelCover: $(
        '<img src="' +
          this.settings.coverUrl +
          '" class="w-50 d-block p-2 mx-auto my-2" />'
      ),
      $leftPanelNavContainer: $('<nav class="nav-bar px-3"></nav>'),
      $rightPanel: $(
        '<div class="col-9 custom-light-panel-bg vh-100 overflow-auto position-relative px-5 rounded-lg custom-font"><div class="min-vh-100 my-5 p-5 border-0 shadow-sm mx-auto rounded-sm bg-white" style="width:210mm;min-width:210mm"><div class="overflow-hidden"><span class="border-bottom border-right float-left" style="width:1.5rem;height:1.5rem"></span><span class="border-left border-bottom float-right" style="width:1.5rem;height:1.5rem"></span></div><div class="card px-4 py-4 border-0"></div></div></div>'
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

      /* 倒序加载DOM */
      debugger;
      var $hTagDoms =
        this.$domData.filter("h1,h2,h3,h4,h5,h6").length == 0
          ? this.$domData.find("h1,h2,h3,h4,h5,h6")
          : this.$domData.filter("h1,h2,h3,h4,h5,h6");

      for (var i = 0; i < $hTagDoms.length; i++) {
        var currentItem = $hTagDoms[i],
          $currentItem = $(currentItem);

        /* 给文档中的H标签添加锚点 */
        $currentItem.attr("id", $currentItem.text());

        if (currentItem.tagName == "H1") {
          var $nextLevelItem = $(
            '<a class="nav-link text-black-50 py-3 text-left px-4 rounded-sm small custom-link custom-light-border" data-level="1" href="#' +
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

      this.components.$leftPanelNavContainer
        .children()
        .first()
        .css("background", "#a2c9f9");

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
      this.components.$rightPanel
        .find("div.card")
        .parent()
        .append(
          '<div class="overflow-hidden"><span class="border-top border-right float-left" style="width:1.5rem;height:1.5rem"></span><span class="border-left border-top float-right" style="width:1.5rem;height:1.5rem"></span></div>'
        );

      this.components.$container.children().append(this.components.$rightPanel);
      this.$ele.append(this.components.$container);
    },
    initEvents: function () {
      this.components.$leftPanelNavContainer
        .children()
        .on("click", $.proxy(this.showOrHideChildLevel, this));

      this.components.$leftPanelNavContainer
        .find("a")
        .on("click", $.proxy(this.ShowLevelContent, this));
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
        '<a class="nav-link py-2 text-left px-4 small rounded-sm custom-purple-font custom-light-border custom-small-font custom-link" href="#' +
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
          '&nbsp;&nbsp;<i class="fa fa-angle-right text-black-50" aria-hidden="true"></i>'
        );
        var $nextLevelContainer = $(
          "<div class='rounded-sm' style='background-color:rgb(238 242 245)'></div>"
        );
        $nextLevelContainer.append($nextLevelItem);
        $nextLevelContainer.hide();
        $parentLevel.after($nextLevelContainer);
      } else {
        $parentLevel.next().append($nextLevelItem);
      }
    },
    /* 在左侧导航栏点击不同的一级链接时在右侧只显示该一级标题下的内容 */
    ShowLevelContent: function (e) {
      var $targetLevel = $(e.target);

      /*  左侧导航栏选中项的背景色设置*/
      this.components.$leftPanelNavContainer.find("a").removeAttr("style");
      $targetLevel.css("background", "#a2c9f9");

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

        /*  确定右侧panel底部定位器的数量，如果已经存在，则不必重复添加*/
        var bottomLocatorNum = this.components.$rightPanel.find(
          "span.border-top.border-right"
        ).length;
        if (bottomLocatorNum === 0) {
          this.components.$rightPanel
            .find("div.card")
            .parent()
            .append(
              '<div class="overflow-hidden"><span class="border-top border-right float-left" style="width:1.5rem;height:1.5rem"></span><span class="border-left border-top float-right" style="width:1.5rem;height:1.5rem"></span></div>'
            );
        }
      }
    },
  };

  $.fn.Reader = function (options) {
    return this.each(function () {
      new Reader(this, options);
    });
  };
})(jQuery, window, document);
