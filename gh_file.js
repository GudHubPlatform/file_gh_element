
angular.module('ghFileModule', [

])

.directive('ghFile', [ '$compile', 'authService', 'cnfg', 'fileManager', 'fileHelper', '$timeout', function($compile, authService, cnfg, fileManager, fileHelper, $timeout) {
  var directive = {};

  directive.scope = {
    ghModel: '=',
    ghAppId: '=',
    ghItemId: '=',
    fieldDataModel: '=',
    ghMode: '@',
    editable: '=',
    ghFieldData: "="
  };

  directive.controller = [ '$scope', function($scope) {

    $scope.$watch('ghModel', function(ids){
      $scope.currentIds = $scope.ghModel ? $scope.ghModel.split(',').map(function(item) {return parseInt(item);}) : [];
      getFiles();
    });
    $scope.fileList = [];
    $scope.showSuccessCopyPopup = false;

    function getFiles(){
      return new Promise((resolve) => {
        fileManager.getFiles($scope.ghAppId, $scope.currentIds).then(function(files) {
          $scope.fileList = files.filter(function(file){
              file.url = file.url;

            return file.url && file.file_id;
          });
          resolve()
          $scope.$digest();
        });
      })
    }

    /* addind new file*/
    function addFileID(id) {
      $timeout(function() {
        if ($scope.fieldDataModel.display_mode === 'multiple') {
          $scope.currentIds.push(id);
          $scope.ghModel = $scope.currentIds.join();
          getFiles();
        } else {
          if ($scope.currentIds.length) {
            fileManager.deleteFile($scope.currentIds[0], $scope.ghAppId).then(
              function() {
                $scope.currentIds = [id];
                $scope.ghModel = $scope.currentIds.join();
                getFiles();
              }
            );
          } else {
            $scope.currentIds = [id];
            $scope.ghModel = $scope.currentIds.join();
            getFiles();
          }
        }
      }, 0);
    }

    /* deleting file*/
    $scope.deleteFile = function(id) {
      fileManager.deleteFile(id, $scope.ghAppId).then(
        $timeout(function() {
          $scope.currentIds.splice($scope.currentIds.indexOf(id), 1);
          $scope.ghModel = $scope.currentIds.join();
          getFiles();
        }, 0)
      );
    };



    $scope.onloadFile = function(file) {

      return new Promise(function(resolve, reject) {

        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {

          // Its nead when user upload file no extension
          var nameLast = file.name.lastIndexOf('.') < 0 ? file.name.length : file.name.lastIndexOf('.');

          var extensionLast = file.name.lastIndexOf('.') < 0 ? file.name.length : file.name.lastIndexOf('.') + 1;

          var fileObj = {
            format:  'base64',
            source: fileLoadedEvent.target.result.split(',')[1],
            file_name: file.name.substr(0, nameLast),
            extension: file.name.substr(extensionLast),
            app_id: $scope.ghAppId,
            item_id: $scope.ghItemId,
            element_id: $scope.ghFieldData.element_id
          };

          fileObj.file_name = fileObj.file_name.length > 15 ? fileObj.file_name.split('').splice(0, 14).join('') : fileObj.file_name;

          fileManager.uploadFileFromString(fileObj).then(function(response) {
            addFileID(response.file_id);
            resolve();
            $scope.$digest();
          }, function() {
            $scope.showError('File upload error');
            resolve();
          });

        };

        fileReader.readAsDataURL(file);

      });

    };

    $scope.downloadFile = async function(file) {
      await getFiles();
      const fileToDownload = $scope.fileList.find(newFile => newFile.file_id == file.file_id) || file;
      fileHelper.downloadFile(fileToDownload);
    };

    $scope.copyFileUrl = (file) => {
      const input = document.createElement('input');
      input.setAttribute('value', file.url);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      $scope.showSuccessCopyPopup = true;
      setTimeout(() => {
        $scope.showSuccessCopyPopup = false;
        $scope.$digest();
      }, 1000);
    }


    $scope.getExtensionColor = function(extension){
      var color;
      switch (extension) {
        case 'rar':
        case 'zip':
        case '7zip':
          color = '79C471';
          break;
        case 'xls':
        case 'xlsx':
          color = '79C471';
          break;
        case 'psd':
        case 'doc':
        case 'txt':
        case 'docx':
          color = '4288bc';
          break;
        case 'jpg':
        case 'jpeg':
        case 'svg':
          color = 'f8a557';
          break;
        case 'pdf':
        case 'png':
        case 'gif':
          color = 'f07168';
          break;
        default:
          color = '555555';
      }
      return color;
    };

  }];


  directive.template = function(tElement, tAttrs) {
    var template =
      '<div>' +
      ' <div class="gh-file-list">' +
      '   <div ng-switch="ghMode">' +
      // ------------- file_name ----------------
      '     <div ng-switch-when="file_name">' +
      '       <div ng-show="ghItemId" ng-repeat="file in fileList"><a ng-href="{{file.url}}" class="gh_file_name">{{file.file_name + \'.\' + file.extension}}</a></div>'+
      '       <div ng-show="!ghItemId"><p>file.txt</p></div>'+
      '     </div>' +
      // --------------- url --------------------
      '     <div ng-switch-when="url">' +
      '       <div ng-show="ghItemId" ng-repeat="file in fileList" ><a ng-href="{{file.url}}">{{file.url}}</a></div>'+
      '       <div ng-show="!ghItemId"><p>https://file.txt</p></div>'+
      '     </div>' +
      // --------------- icon --------------------
      '     <div ng-switch-when="icon">' +
      '        <a ng-show="ghItemId" ng-repeat="file in fileList" gh-icon="file 0fb5ff 40px" ng-href="{{file.url}}"></a>'+
      '        <div ng-show="!ghItemId" gh-icon="file 0fb5ff 64px"></div>'+
      '      </div>' +
      // --------------- file --------------------
      '      <div ng-switch-default class="gh_file_wrapp">' +
      '        <div ng-show="!ghItemId">'+
      '          <div gh-icon="file 0fb5ff 64px"></div>'+
      '          <div class="text-center" style=" max-width: 100px; margin: auto; max-height: 45px"><p style="overflow: hidden; text-overflow: ellipsis">file.txt</p></div>' +
      '        </div>' +
      '        <div class="file" ng-repeat="file in fileList" ng-show="ghItemId">'+
      '        <div class="dropdown">' +
      '         <div class="dropdown_icon">...</div>' +
      '           <div class="dropdown_elements">'+
      '             <div ng-click="downloadFile(file)" class="download"><span gh-icon="install 0893d2 20px normal"></span>Download File</div>'+
      '             <div ng-click="copyFileUrl(file)" class="copy"><span gh-icon="reference 0893d2 20px normal"></span>Copy File URL <div ng-show="showSuccessCopyPopup" class="success_copy">Copied!</div></div>'+
      '             <div ng-if="(+editable)" ng-click="deleteFile(file.file_id)" class="delete"><span gh-icon="rubbish 0893d2 20px normal"></span>Delete File</div>'+
      '           </div>' +
      '         </div>' +
      '           <div ng-click="downloadFile(file)">'+
      '             <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="50 100 412 300" height="120" width="125" y="0px" xml:space="preserve">' +
      '               <style type="text/css">.st0{fill:#E0E0E0;} .st1{fill:#FFFFFF;} .st5{font-family:"Vrinda"; text-transform:uppercase} .st6{font-size:57.6456px;} .nestedsvg{transform: translate(100px,175px) !important;} </style>' +
      '               <path id="shadow_7_" class="st0" d="M95.8,431.2V93.5c0-14.7,10-26.5,24.7-26.5h208.4l86.9,87.4v4.9v271.9c0,11.6-11.2,21.1-27.2,21.1H122.9C106.9,452.3,95.8,442.8,95.8,431.2z"/>' +
      '               <path id="sheet" class="st1" d="M98.9,421.4V90.2c0-13.8,11.2-25,25-25h204.8l84,84.2v273.9c0,14.1-11.5,19.5-25.6,19.5H126.4C111.2,442.8,98.9,436.6,98.9,421.4z"/>' +
      '               <g class="nestedsvg" gh-icon="{{file.extension}} f0f1f2 300px normal"></g>' +
      '               <path class="st2" ng-attr-fill="{{\'#\' + getExtensionColor(file.extension)}}" d="M98.9,94.2c0-13.8,11.2-25,25-25h204.8l84,84.2v57.8H98.9V94.2z"/>' +
      '               <path id="shadow_2_" d="M323.7,69.2l0,74.9c0,7.8,6.3,14.2,14.2,14.2h74.8v-4.9l-84-84.2H323.7z"/>' +
      '               <path id="shadow_14_" class="st3" ng-attr-fill="{{\'#\' + getExtensionColor(file.extension)}}" opacity="0.86" d="M323.7,69.2l0,74.9c0,7.8,6.3,14.2,14.2,14.2h74.8v-4.9l-84-84.2H323.7z"/>' +
      '               <path class="st1" d="M328.7,69.2l0,74.3c0,5.5,4.5,9.9,9.9,9.9h74L328.7,69.2z"/>' +
      '               <path class="st4" ng-attr-fill="{{\'#\' + getExtensionColor(file.extension)}}" opacity="0.81"  d="M328.7,69.2l0,74.3c0,5.5,4.5,9.9,9.9,9.9h74L328.7,69.2z"/>' +
      '               <text style="font-family:"Vrinda"; text-transform:uppercase" id="Email" transform="matrix(1 0 0 1 143.9614 158.9902)" class="st1 st5 st6">{{file.extension}}</text>' +
      '             </svg>' +
      '           <div class="file-name"><p>{{file.file_name + "." + file.extension}}</p></div>' +
      '         </div>'+
      '        </div>'+
      ' <div ng-if="(+editable)" ng-show="fieldDataModel.display_mode == \'multiple\' && ghItemId || fieldDataModel.display_mode != \'multiple\' && !currentIds.length && ghItemId" gh-file-reader on-load-file="onloadFile(file)" load-file-disabled="false" class="gh-file-list_item {{fieldDataModel.display_mode}}">' +
      '   <div gh-icon="file ffffff 90%"></div>' +
      ' </div>' +
      '      </div>' +
      ' </div>' +
      '</div>';

    return template;
  };

  return directive;
}]);
