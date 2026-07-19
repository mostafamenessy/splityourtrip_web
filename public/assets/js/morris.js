 
!function($) {
  "use strict";

  var MorrisCharts = function() {};

  MorrisCharts.prototype.createDonutChart = function(element, data, colors) {
    Morris.Donut({
      element: element,
      data: data,
      resize: true,
      colors: colors,
      formatter : function (y, data) { 
        return "per month"
      }
    });
  },
  
  MorrisCharts.prototype.init = function() {

    var $donutData = [
        {label: "$ 4,409.39", value: 44},
        {label: "$ 5,409.39", value: 54},
        {label: "$ 6,409.39", value: 64},
    ];
    this.createDonutChart('morris-donut-1', $donutData, ['#EB6E85', '#58A0E5', '#C6D443', '#FFBA93', '#FFE99A', '#B0E7FF']);
  },

  $.MorrisCharts = new MorrisCharts, $.MorrisCharts.Constructor = MorrisCharts
}(window.jQuery),

function($) {
  "use strict";
  if ($("div").hasClass("pie-chart")) {
    $.MorrisCharts.init();
  }
}(window.jQuery);