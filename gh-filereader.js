

/********************************************************************************************************/
/***********************************   GH UPLOAD DIRECTIVE    *******************************************/
/********************************************************************************************************/
/*  Upload file with HTML5 file uploader and Drag & Drop */

/********************************************************************************************************/

angular.module('ghFilereaderModule', [])

.directive('ghFileReader', [function(){

  return {
    restrict: 'A',
    replace: false,
    transclude: true,
    template:
      '<div class="file-reader" ng-class="{\'load-file\': loadFileDisabled}">' +
      ' <div class="file-reader-content" ng-transclude></div>' +
      ' <div class="cloud-keyframe" gh-icon="cloud ffffff 55%" ></div>' +
      ' <div class="file-reader-text">Drag &amp; Drop or Click to Upload</div>'+
      ' <svg xmlns="http://www.w3.org/2000/svg" class="file-load" viewBox="25 25 50 50">'+
      '   <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>'+
      ' </svg>'+
      '</div>',
    scope: {
      onLoadFile: '&',
      loadFileDisabled: '=',
      displayMode: '='
    },
    link: function(scope, element, attrs){

      // If 'undefined' disabled, set default: true
      if(scope.loadFileDisabled){
        scope.loadFileDisabled = false;
      }

      function load(flag) {
        scope.loadFileDisabled = flag;
      }

      function LoadFile(file){
        return new Promise(resolve => {
        if(!Boolean(scope.loadFileDisabled)){
          load(true);
          scope.onLoadFile({file:file}).then(function () {
            load(false);
            resolve()
          }, function (err) {
            load(false);
          });
        }
        })
      }
      
      var inputFile = document.createElement("INPUT");
      inputFile.setAttribute("type", "file");
      if(scope.displayMode == 'multiple'){
        inputFile.setAttribute('multiple', true);
      }
     
      inputFile.addEventListener("change", async function(event){
        console.log(event.target.files);

       for(let file of event.target.files){
         if(file){
           await LoadFile(file);
         }
       }
       
      });

      element.on('click', function(event){
        event.stopPropagation();
        if(!Boolean(scope.loadFileDisabled)){
          inputFile.click();
        }
      });

      /* drag and drop events*/
      var count = 0;
      element.on('mouseenter dragenter', function(event) {
        count++;
        element.addClass('loading-file');
        event.preventDefault();
        return false;
      });

      /* it's for prevent opening file in browser*/
      element.on('dragover', function(event) {
        event.preventDefault();
      });

      element.on('mouseleave dragleave', function(event) {
        count--;
        if (!count){
          element.removeClass('hover');
        }
        event.preventDefault();
      });

      element.on('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        element.removeClass('hover');
        count = 0;
        LoadFile(event.dataTransfer.files[0]);
      });

    }
  };

}]);
