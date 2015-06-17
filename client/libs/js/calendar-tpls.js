angular.module("ui.rCalendar.tpls", ["template/rcalendar/calendar.html","template/rcalendar/week.html"]);
angular.module('ui.rCalendar', ['ui.rCalendar.tpls'])

    .controller('CalendarController', ['$scope', '$attrs', function ($scope, $attrs) {
        'use strict';
        var self = this,
            ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl;

    }])
    .directive('calendar', function () {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/calendar.html',
            scope: {
                rows: '=',
                workers: '='
            },
            require: ['calendar', '?^ngModel'],
            controller: 'CalendarController',
            link: function (scope, element, attrs, ctrls) {
            }
        };
    })
    .directive('weekview', ['dateFilter', '$timeout', function (dateFilter, $timeout) {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/week.html',
            require: '^calendar',
            link: function (scope, element, attrs, ctrl) {               
            }

        };
    }])

angular.module("template/rcalendar/calendar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/calendar.html",
    "<div>\n" +
    "    <div class=\"row calendar-navbar\">\n" +
    "        <div class=\"calendar-header col-xs-12 pull-right\"> \n" +
    "           <ul class=\"pagination pull-right\"> \n" +
    "                <li>  \n" + 
    "                  <a href=\"#\" aria-label=\"Previous\">  \n" +
    "                    <span aria-hidden=\"true\">&laquo;</span>  \n" +
    "                  </a>  \n" +
    "                </li>  \n" +
    "                <li><a href=\"#\">1</a></li>  \n" +
    "                <li><a href=\"#\">2</a></li>  \n" +
    "                <li><a href=\"#\">3</a></li>  \n" +
    "               <li><a href=\"#\">4</a></li>  \n" +
    "                <li><a href=\"#\">5</a></li>  \n" +
    "                <li>  \n" +
    "                  <a href=\"#\" aria-label=\"Next\">  \n" +
    "                    <span aria-hidden=\"true\">&raquo;</span>  \n" +
    "                  </a>  \n" +
    "                </li> \n" +
    "            </ul></div>\n" +
    "    </div>\n" +
    "    <weekview></weekview>\n" +
    "</div>");
}]);

angular.module("template/rcalendar/week.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/week.html",
    "<div>\n" +
    "    <table class=\"table table-bordered table-fixed weekview-header\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"calendar-hour-column\"> \n" +
    "               <span>Fecha</span>   \n" +
    "            </th>\n" +
    "            <th ng-repeat=\"worker in workers\" class=\"text-center weekview-header-label\">{{worker.name}}</span></th>\n" +
    "            <th style=\"width:17px\"></th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "    </table>\n" +
    "    <div class=\"scrollable\">\n" +
    "        <table class=\"table table-bordered table-fixed\">\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"row in rows\">\n" +
    "                <td class=\"calendar-hour-column text-center\">\n" +
    "                    {{row | date: \"dd.MM\"}}\n" +
    "                </td>\n" +
    "                <td ng-repeat=\"worker in workers\" class=\"calendar-cell\" \n" +
    "                    ng-class=\"{true:'weekend', false:''}[row.getDay()==6 || row.getDay()==0]\">\n" +    
    "                    <div ng-repeat=\"event in worker.events\" \n" +
    "                         class=\"calendar-event-wrap\" \n" +
    "                         ng-click=\"eventClick(worker.name,event)\" \n" +
    "                         style=\"height: {{event.duration*103}}%; padding: 0px\" \n" +
    "                         ng-if=\"event.start.getDate()===row.getDate() &&  \n" +
    "                         event.start.getMonth()===row.getMonth()\"> \n" +
    "                           <span style=\"color:white\">{{event.name}}</span> \n" +
    "                    </div>\n"  +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);