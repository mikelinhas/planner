angular.module('app', ['ui.bootstrap','ui.grid','ui.grid.pinning']);

var app = angular.module('app')

app.controller('MainCtrl', ['$scope', '$timeout','$modal', 'DataService', function ($scope, $timeout, $modal, DataService) {
    'use strict';


  $scope.dates = [];
  var colCount = 30;
  var rowCount = 80;
  var data = [];
  
  //var rowtpl='<div ng-class="{\'weekend\':row.entity.Date == \'11 - Jul\' }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
  //var celltpl = '<event info="{{COL_FIELD}}"></event>';
  var celltpl = '<div class="{{COL_FIELD.class}}" tooltip="{{COL_FIELD.tooltip}}" tooltip-popup-delay=1000><span>{{COL_FIELD.info}}<span></div>';

  $scope.gridOptions = {
    enableSorting: false,
    columnDefs: [],
    //rowTemplate: rowtpl,
    data: []
  };

  function loadData (callback) {
    DataService.getWorkerData(function(worker_data){
      $scope.workers = worker_data;
      callback(1);
    })
  } 

  loadData (function (response) {
    var columns = [];
    var cells = [];
    getDateRange(0,rowCount);

    gridColumns(function (columns_data){
      columns = columns_data;
    });

    gridCells(function (cells_data){
      cells = cells_data;
    });
    
    addData(columns,cells);

  });  

  function addData(columns,cells) {
    $scope.gridOptions.data = cells;
    $scope.gridOptions.columnDefs = columns;
  }


  function getDateRange(start,end) {

    var today = new Date();
    var js_date;

    for (var i = 0; i <= end-1; i++) {
      var js_date = new Date(); 
      js_date.setDate(today.getDate()+i);
      var iso_date = js_date.toISOString();
      $scope.dates.push({"js_date" : js_date, "iso_date" : iso_date });
    };

  }

  function gridColumns(callback) {
    var columns = [];
    for (var colIndex = 0; colIndex < $scope.workers.length+2; colIndex++) {
      if (colIndex == 1) {
        columns.push({
          name: 'Date',
          cellFilter: 'date',
          width: 90,
          pinnedLeft:true
        }); 
      } else if (colIndex == 0) {
        columns.push({
          name: 'Wk',
          width: 70,
          pinnedLeft:true
        }); 
      } else {
        columns.push({
          name: $scope.workers[colIndex-2]._id.name,
          width: 160,
          cellTemplate: celltpl
        });
      }
    }
    callback(columns);
  };
  
  function getWeek (date) {
    var d = new Date(date);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var week = Math.ceil ((((d-new Date(d.getFullYear(),0,1))/8.64e7)+11)/7);
    return week;
  }

  function gridCells(callback) {
    var current_week = -1;
    
    //adding week and date columns
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      var row = {};
      var week = getWeek($scope.dates[rowIndex].js_date);
      if (week !== current_week) {
        row['Wk'] = week;
        current_week = week;
      };
      row['Date'] = $scope.dates[rowIndex].js_date; 
      data.push(row);
    }  
    
    //adding data for each worker
    for (var i = 0; i < $scope.workers.length; i++) { 

      var worker = $scope.workers[i];
      var evento;
      var start;
      var during_start;
      var during_end;
      var end;
      var eventIndex = 0;
      var dateIndex=0;
      var started = 0;

      while (dateIndex < $scope.dates.length && eventIndex < worker.events.length-1) {

        var current_date = new Date ($scope.dates[dateIndex].js_date);
        current_date.setHours(2,0,0,0);
        evento = worker.events[eventIndex];
        start = new Date (evento.start);
        start.setHours(0,0,0,0);
        during_start = new Date (evento.start);
        during_start.setHours(5,0,0,0);
        end = new Date(evento.end);
        end.setHours(0,0,0,0);
        during_end = new Date (end);
        during_end.setDate(end.getDate()-1)
        during_end.setHours(0,0,0,0);

        if (current_date > start && current_date < end) {
          data[dateIndex][worker._id.name] = {info: " ", class:"during", tooltip: evento.project};
          if (current_date < during_start) {
            started = 1;
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"start", tooltip: evento.project};
          };
          if (started == 0) {
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"start", tooltip: evento.project};
            started = 1;
          };
          if (current_date > during_end) {
            if (started == 1){
              data[dateIndex][worker._id.name] = {info: " ", class:"end", tooltip: evento.project};
            } else {
              data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"end", tooltip: evento.project};
            }
          }
          if (current_date > during_end && current_date < during_start) {
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"both", tooltip: evento.project};            
          }
        };
        if (current_date > end) {
          started = 0;
          eventIndex++;
        };
        dateIndex++;
      }; 
    };

    callback(data);
  };
  
  $scope.add = function () {
    
    var worker = [];
    var url = 'libs/html/modal.html'

    var modalInstance = $modal.open({
      templateUrl: url,
      controller: 'ModalInstanceCtrl',
      resolve: {
        worker: function () {
          return worker;
        }
      }
    });

    modalInstance.result.then(function (res) {
      console.log(res);
    }, function () {
      console.log('Modal dismissed');
    });  
  };

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl',["$scope", "$modalInstance", "DataService", function ($scope, $modalInstance, DataService) {

    $scope.step = 1;

    $scope.dates2 = [];
    var colCount;
    var rowCount = 50;
    var data = [];

    $scope.selectworker = function (data) {
      $scope.worker = data;
      $scope.selected = 1;
    };

    $scope.next = function () {
      $scope.step = 2;
      loadData($scope.worker);
    };

    $scope.back = function () {
      $scope.step = 1;
      $scope.selected = 0;
    };

    function getDateRange2(start,end) {

      var today = new Date();
      var js_date;

      for (var i = 0; i <= end-1; i++) {
        var js_date = new Date(); 
        js_date.setDate(today.getDate()+i);
        var iso_date = js_date.toISOString();
        $scope.dates2.push({"js_date" : js_date, "iso_date" : iso_date });
      };
    }

  
    var celltpl = '<div class="{{COL_FIELD.class}}" tooltip="{{COL_FIELD.tooltip}}" tooltip-popup-delay=1000><span>{{COL_FIELD.info}}<span></div>';

    $scope.gridOptions2 = {
      enableSorting: false,
      columnDefs: [],
      data: []
    };

    function loadData (worker) {
      console.log("loading");
      var columns = [];
      var cells = [];
      getDateRange2(0,rowCount);
      console.log("got dates");
      console.log($scope.dates2);
      gridColumns(function (columns_data){
        columns = columns_data;
        console.log("got columns");
        console.log(columns);
      });

      gridCells(function (cells_data){
        cells = cells_data;
        console.log("got data");
        console.log(cells);
      });
      
      addData(columns,cells);

    };  

    function addData(columns,cells) {
      $scope.gridOptions2.data = cells;
      $scope.gridOptions2.columnDefs = columns;
    }

    function gridColumns(callback) {
      var columns = [];
      
      columns.push({
        name: 'Wk',
        width: 60,
        pinnedLeft:true
      }); 
      
      columns.push({
        name: 'Date',
        cellFilter: 'date',
        width: 100,
        pinnedLeft:true
      });

      columns.push({
        name: $scope.worker._id.name,
        width: 160,
        cellTemplate: celltpl
      });
      
      
      callback(columns);
    };
  
    function getWeek (date) {
      var d = new Date(date);
      d.setHours(0,0,0);
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      var week = Math.ceil ((((d-new Date(d.getFullYear(),0,1))/8.64e7)+11)/7);
      return week;
    }

    function gridCells(callback) {
      var current_week = -1;
      
      //adding week and date columns
      for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        var row = {};
        var week = getWeek($scope.dates2[rowIndex].js_date);
        if (week !== current_week) {
          row['Wk'] = week;
          current_week = week;
        };
        row['Date'] = $scope.dates2[rowIndex].js_date; 
        data.push(row);
      }  
      
      var worker = $scope.worker;
      var evento;
      var start;
      var during_start;
      var during_end;
      var end;
      var eventIndex = 0;
      var dateIndex=0;
      var started = 0;

      while (dateIndex < $scope.dates2.length && eventIndex < worker.events.length-1) {

        var current_date = new Date ($scope.dates2[dateIndex].js_date);
        current_date.setHours(2,0,0,0);
        evento = worker.events[eventIndex];
        start = new Date (evento.start);
        start.setHours(0,0,0,0);
        during_start = new Date (evento.start);
        during_start.setHours(5,0,0,0);
        end = new Date(evento.end);
        end.setHours(0,0,0,0);
        during_end = new Date (end);
        during_end.setDate(end.getDate()-1)
        during_end.setHours(0,0,0,0);

        if (current_date > start && current_date < end) {
          data[dateIndex][worker._id.name] = {info: " ", class:"during", tooltip: evento.project};
          if (current_date < during_start) {
            started = 1;
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"start", tooltip: evento.project};
          };
          if (started == 0) {
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"start", tooltip: evento.project};
            started = 1;
          };
          if (current_date > during_end) {
            if (started == 1){
              data[dateIndex][worker._id.name] = {info: " ", class:"end", tooltip: evento.project};
            } else {
              data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"end", tooltip: evento.project};
            }
          }
          if (current_date > during_end && current_date < during_start) {
            data[dateIndex][worker._id.name] = {info: evento.project.slice(0,12), class:"both", tooltip: evento.project};            
          }
        };
        if (current_date > end) {
          started = 0;
          eventIndex++;
        };
        dateIndex++;
      }; 

      callback(data);
    };



    $scope.applychanges = function (data) {
      $scope.worker = data;
    };

    $scope.ok = function () {
      $modalInstance.close($scope.worker);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

app.controller('SettingsCtrl', ["$scope", "DataService", function($scope, DataService) {
  $scope.data = [];

  $scope.importWorkers = function (data) {
    console.log("hi");
    DataService.importWorkers(JSON.parse(data));
  }

  $scope.importEvents = function (data) {
    var events = JSON.parse(data); 
    var start_day = 0;
    var start_month = 0;
    var start_year = 0;
    var end_day = 0;
    var end_month = 0;
    var end_year = 0;


    for (var i = events.length - 1; i >= 0; i--) {
      start_day = parseInt(events[i].start.slice(0,2));
      start_month = parseInt(events[i].start.slice(3,5));
      start_year = parseInt(events[i].start.slice(6,10));
      end_day = parseInt(events[i].end.slice(0,2));
      end_month = parseInt(events[i].end.slice(3,5));
      end_year = parseInt(events[i].end.slice(6,10));
      var start_date = new Date(start_year,start_month,start_day,4,0,0,0);
      var end_date = new Date(end_year,end_month,end_day,4,0,0,0);
      events[i].start = start_date.toISOString();
      events[i].end = end_date.toISOString();
    };
    DataService.importEvents(events);
  }
}])

app.service('DataService', function ($rootScope, HTTPService) {


  // GET THE ARTICLES
  $rootScope.workers = [];

  this.getEvent =function (date, worker) {
    HTTPService.getEvent(date, worker).then ( function (result){
      console.log(result);
      return result
    });
  }

  this.addEvent =function (worker_id, evento) {
    HTTPService.addEvent(worker_id, evento).then ( function (result){
      loadRemoteData();
      console.log(result);
    });
  }


  this.importWorkers =function (data) {
    HTTPService.importWorkers(data).then ( function (result){
      console.log(result);
    });
  }

  this.importEvents =function (data) {
    console.log(data)
    HTTPService.importEvents(data).then ( function (result){
      console.log(result);
    });
  }

  this.getWorkerData = function (callback) {
    HTTPService.getWorkers().then( function (workers) {
      $rootScope.workers = workers;
      callback(workers);
    });
  };

});

app.service('HTTPService', function ($http, $q) {

  return({getWorkers: getWorkers,
          addEvent: addEvent,
          importWorkers: importWorkers,
          getEvent: getEvent,
          importEvents: importEvents});

    function deleteArticle (id) {
      var request = $http({
        method: "delete",
        url: "/rest/articles/delete",
        params: {
          action: "delete"
        },
        data: {
          id: id
        },
          headers: {"Content-Type": "application/json;charset=utf-8"}
      });
      return( request.then( handleDeleteSuccess, handleError ))
    }

    function handleDeleteSuccess( response ) {
     
      return( response.status );
    }

    function addArticle( article ) {
        var request = $http({
            method: "post",
            url: "rest/articles/add",
            params: {
                action: "post"
            },
            data: {
                Code: article.Code,
                Description: article.Description,
                Category: article.Category,
                Subcategory: article.Subcategory
            }
        });
        return( request.then( handlePostSuccess, handleError ) );
    }

    function importWorkers( data ) {
        var request = $http({
            method: "post",
            url: "rest/data/importWorkers",
            params: {
                action: "post"
            },
            data: {
                data: data
            }
        });
        return( request.then( handlePostSuccess, handleError ) );
    }

    function importEvents( data ) {
        var request = $http({
            method: "post",
            url: "rest/data/importEvents",
            params: {
                action: "post"
            },
            data: {
                data: data
            }
        });
        return( request.then( handlePostSuccess, handleError ) );
    }

    function importEvents2( data ) {
        var request = $http({
            method: "post",
            url: "rest/data/importEvents2",
            params: {
                action: "post"
            },
            data: {
                data: data
            }
        });
        return( request.then( handlePostSuccess, handleError ) );
    }

    function handlePostSuccess( response ) {
      return( response.status );
    }

    function getWorkers() {
        var request = $http({
            method: "get",
            url: "/rest/data",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function getEvent(date,worker) {
        var request = $http({
            method: "get",
            url: "/rest/data/getEvent",
            params: {
                action: "get",
                date: date,
                worker: worker
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

    function addEvent(worker_id, evento) {
        var request = $http({
            method: "post",
            url: "rest/data/addEvent",
            params: {
                action: "post"
            },
            data: {
                worker_id: worker_id,
                evento: evento
            }
        });
        return( request.then( handlePostSuccess, handleError ) );
    }

    function handleSuccess( response ) {
      return( response.data );
    }

    function handleError( response ) {
         if (
             ! angular.isObject( response.data ) ||
             ! response.data.message
             ) {
             return( $q.reject( "An unknown error occurred." ) );
         }
         // Otherwise, use expected error message.
         return( $q.reject( response.data.message ) );
     }
});
