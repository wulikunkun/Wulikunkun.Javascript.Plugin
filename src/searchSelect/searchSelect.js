(function(jQuery, window, document, undefined) {
  function SearchSelect(ele, options) {
    this.$ele = $(ele);
    this.defaults = {
      data: []
    };
    this.components = {
      $dropdownContainer: $(
        "<div style='display:inline-block;position:relative;'></div>"
      ),
      $dropdown: $(
        "<div style='border:1px solid lightgray;border-radius:3px;display:none' class='cnki_wulikunkun_dropdown'></div>"
      ),
      $noResultAlert: $(
        "<option style='cursor:pointer;padding:2px 10px;text-align:left'>没有搜索到对应学校！</option>"
      )
    };
    this.settings = $.extend({}, this.defaults, options);
    this.init();
  }

  SearchSelect.prototype = {
    init: function() {
      this.initStyle();
      this.initEvents();
    },
    initStyle: function() {
      this.$ele.css({
        "border-radius": "5px",
        "font-size": "16px",
        height: "25px",
        padding: "3px 10px",
        outline: "none",
        width: "160px",
        display: "inline-block",
        border: "1px solid lightgray"
      });

      //   jquery中的wrap方法是将参数中的元素包裹到调用wrap方法的元素的外面;
      this.$ele.wrap(this.components.$dropdownContainer);
      this.$ele.after(this.components.$dropdown);
      this.components.$dropdown.width(this.$ele.innerWidth());

      for (var i = 0; i < this.settings.data.length; i++) {
        this.components.$dropdown.append(
          "<option style='cursor:pointer;padding:3px 10px;text-align:left'>" +
            this.settings.data[i] +
            "</option>"
        );
      }
    },
    initEvents: function() {
      var self = this;

      this.$ele.on("focus", $.proxy(this.showPanel, this));
      this.$ele.on("blur", $.proxy(this.hidePanel, this));

      this.$ele.bind(
        "input propertychange change",
        $.proxy(this.filterOptions, this)
      );

      this.$ele.parent().on("click", "option", $.proxy(this.selectItem, this));

      this.$ele
        .parent()
        .on("mouseover", "option", $.proxy(this.changeItemBackcolor, this));

      this.$ele
        .parent()
        .on(
          "mouseout",
          "option",
          $.proxy(this.changeItemBackcolorToOriginal, this)
        );

      // 比较这里在一个function中调用proxy和上面直接代用proxy的区别
      this.components.$dropdown.on("mouseover", function() {
        self.$ele.unbind("blur", $.proxy(self.hidePanel, self));
      });

      this.components.$dropdown.on("mouseout", function() {
        self.$ele.bind("blur", $.proxy(self.hidePanel, self));
      });

      // $(document).on("click", $.proxy(this.hidePanel, this));
      // $(document).on("click", ":not(.cnki_wulikunkun_dropdown)", function() {
      //   alert("触发");
      // });
    },
    showPanel: function() {
      this.components.$dropdown.show();
    },
    hidePanel: function() {
      debugger;
      this.components.$dropdown.hide();
    },
    filterOptions: function() {
      this.components.$noResultAlert.remove();

      var searchContent = this.$ele.val();
      var filteredData = [];
      for (var i = 0; i < this.settings.data.length; i++) {
        if (this.settings.data[i].indexOf(searchContent) > -1) {
          filteredData.push(this.settings.data[i]);
        }

        this.$ele
          .parent()
          .find("option")
          .each(function(index, item) {
            if (
              filteredData.indexOf(
                $(item)
                  .text()
                  .trim()
              ) == -1
            ) {
              $(item).hide();
            } else {
              $(item).show();
            }
          });
      }
      if (filteredData.length == 0) {
        this.components.$dropdown.append(this.components.$noResultAlert);
      }
    },
    selectItem: function(e) {
      this.$ele.val($(e.target).text());
      this.hidePanel();
      debugger;
      this.$ele.bind("blur", $.proxy(this.hidePanel, this));
    },
    changeItemBackcolor: function(e) {
      $(e.target).css("background-color", "lightgray");
    },
    changeItemBackcolorToOriginal: function(e) {
      $(e.target).css("background-color", "white");
    }
  };

  $.fn.SearchSelect = function(options) {
    return this.each(function() {
      new SearchSelect(this, options);
    });
  };
})(jQuery, document, window);

// Author info:Wang Kun
// Date: 2019-12-10-13-33-04
// Dependency: jQuery 1.7.0
