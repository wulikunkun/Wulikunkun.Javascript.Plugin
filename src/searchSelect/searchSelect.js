; (function (jQuery, window, document, undefined) {
  function SearchSelect(ele, options) {
      this.$ele = $(ele);
      this.defaults = {
          data: [],
          maxHeight: 200,
          defaultIndex: 0
      };
      this.components = {
          $dropdownContainer: $(
              "<div style='display:inline-block;position:relative;'></div>"
          ),
          $dropdown: $(
              "<div style='border:1px solid lightgray;border-radius:3px;display:none;overflow-y:scroll;overflow-x:hidden;position:absolute;z-index:10000;background-color:white' class='cnki_wulikunkun_dropdown'></div>"
          ),
          $noResultAlert: $(
              "<option style='cursor:pointer;padding:2px 10px;text-align:left;font-size:14px;color:gray'>没有搜索到对应学校！</option>"
          )
      };
      this.settings = $.extend({}, this.defaults, options);
      this.init();
  }

  SearchSelect.prototype = {
      init: function () {
          this.initStyle();
          this.initEvents();
      },
      initStyle: function () {
          this.$ele.css({
              "font-size": "14px",
              height: "25px",
              padding: "3px 6px",
              outline: "none",
              width: "180px",
              display: "inline-block",
              border: "1px solid rgb(230,230,230)"
          });
          this.$ele.attr("autocomplete", "off");

          this.components.$dropdown.css("max-height", this.settings.maxHeight);
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
          this.$ele.val(this.settings.data[this.settings.defaultIndex]);
      },
      initEvents: function () {
          var self = this;
          this.$ele.on("focus", $.proxy(this.showPanel, this));
          this.$ele.on("blur", $.proxy(this.hidePanel, this));
          this.$ele.bind("input propertychange change", $.proxy(this.filterOptions, this));
          this.$ele.parent().on("click", "option", $.proxy(this.selectItem, this));
          this.$ele.parent().on("mouseover", "option", $.proxy(this.changeItemBackcolor, this));
          this.$ele.parent().on("mouseout", "option", $.proxy(this.changeItemBackcolorToOriginal, this)
          );

          // 比较这里在一个function中调用proxy和上面直接代用proxy的区别
          this.components.$dropdown.on("mouseover", function () {
              self.$ele.unbind("blur", $.proxy(self.hidePanel, self));
          });
          this.components.$dropdown.on("mouseout", function () {
              self.$ele.bind("blur", $.proxy(self.hidePanel, self));
          });
      },
      showPanel: function () {
          this.filterOptions(true);
          this.components.$dropdown.show();
      },
      hidePanel: function () {
          this.components.$dropdown.hide();
      },
      filterOptions: function (isJustShowPanel = false) {
          this.components.$noResultAlert.remove();
          var searchContent = this.$ele.val();
          if (isJustShowPanel === true)
              searchContent = "";
          var filteredData = [];
          for (var i = 0; i < this.settings.data.length; i++) {
              if (this.settings.data[i].indexOf(searchContent) > -1) {
                  filteredData.push(this.settings.data[i]);
              }
              this.$ele.parent().find("option").each(function (index, item) {
                  if (filteredData.indexOf($(item).text().trim()) === -1) {
                      $(item).hide();
                  } else {
                      $(item).show();
                  }
              });
          }
          if (filteredData.length === 0) {
              this.components.$dropdown.append(this.components.$noResultAlert);
          }
      },
      selectItem: function (e) {
          this.$ele.val($(e.target).text());
          //这里必须调用一下input的change方法才能将input发生改变的值通知knockout
          this.$ele.change();
          this.hidePanel();
          this.$ele.bind("blur", $.proxy(this.hidePanel, this));
      },
      changeItemBackcolor: function (e) {
          $(e.target).css("background-color", "lightgray");
      },
      changeItemBackcolorToOriginal: function (e) {
          $(e.target).css("background-color", "white");
      }
  };

  $.fn.SearchSelect = function (options) {
      return this.each(function () {
          new SearchSelect(this, options);
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