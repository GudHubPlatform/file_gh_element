require('./gh_file.scss');
require('./gh_file.js');
require('./gh-filereader.js');
require('./file_reader.scss');


export default class FiletData {
	constructor() {

	}
  /*------------------------------- FIELD TEMPLATE --------------------------------------*/
  getTemplate() {
    return {
      constructor: 'file',
      name: 'File',
      icon: 'box',
      type: 'file',
      model: {
        field_id: 0,
        field_name: 'File',
        field_value: '',
        data_type: 'file',
        data_model: {
          display_mode: 'single',
            interpretation : [
              {
                src: 'table',
                id: 'icon',
                settings:{
                  editable: 0,
                  show_field_name: 0,
                  show_field: 1
                }
              },{
                src: 'form',
                id: 'default',
                settings:{
                  editable: 1,
                  show_field_name: 1,
                  show_field: 1
                }
              },{
                src: 'dropdown',
                id: 'file_name',
                settings:{
                  editable: 0,
                  show_field_name: 0,
                  show_field: 1
                }
              },{
                src: 'input',
                id: 'file_name',
                settings:{
                  editable: 0,
                  show_field_name: 0,
                  show_field: 1
                }
              },{
                src: 'input_list',
                id: 'icon',
                settings:{
                  editable: 0,
                  show_field_name: 0,
                  show_field: 1
                }
              }
            ]
        }
      }
    };
  }



  /*--------------------------  FIELD FIELD SETTINGS --------------------------------*/
  getSettings(fieldSettingsScope) {

    return[{
      title: 'Options',
      type: 'general_setting',
      icon: 'menu',
      columns_list:[
        [],[
          {
            title: 'Type',
            type: 'header'
          },{
            type: 'ghElement',
            property: 'data_model.display_mode',
            data_model: function () {
              return {
                data_model:{
                  interpretation:[
                    {
                      src: 'form',
                      settings:{
                        show_field_name: 0,
                      }
                    }
                  ],
                  multiple_value: 0,
                  options:[
                    {
                      name: 'Single',
                      icon: 'file',
                      color: '#edf2f7',
                      value: 'single'
                    },{
                      name: 'Multiple',
                      icon: 'file_multiple',
                      color: '#edf2f7',
                      value: 'multiple'
                    }
                  ],
                },
                data_type: 'radio_icon'
              };
            }
          }
        ]
      ]
    }];
  }

  /*--------------------------  FILTER --------------------------------*/
  filter = {
    _search_options: [{
      id: 'value',
      name: 'Value',
      html: '<gh-input gh-dropdown="[{name: \'Is Defined\', value: \'true\'}, {name: \'Is Not Defined\', value: \'false\'}]" ng-model="filter.valuesArray[0]" gh-data-type="text_opt" size="small"/>'
    }],

    getSearchOptions: function() {
      return this._search_options;
    }
  }

  /*-----------------------------  INTERPRETATION -------------------------*/

  getInterpretation(gudhub, fieldValue, appId, itemId, field_model){
    
    return [{
      id: 'default',
      name: 'Input',
      content: ()=>
        '<gh-file field-data-model="field_model.data_model" gh-model="field_model.field_value" gh-item-id="itemId" gh-app-id="appId" editable="field_model.settings.editable" gh-field-data="field_model">></gh-file>'
    }, {
      id: 'icon',
      name: 'Icon',
      content: ()=>
        '<gh-file field-data-model="field_model.data_model" gh-model="field_model.field_value" gh-item-id="itemId" gh-app-id="appId" gh-mode="icon" editable="field_model.settings.editable" gh-field-data="field_model">></gh-file>'
      }, {
      id: 'url',
      name: 'Url',
      content: ()=>
        '<gh-file field-data-model="field_model.data_model" gh-model="field_model.field_value" gh-item-id="itemId" gh-app-id="appId" gh-mode="url" editable="field_model.settings.editable" gh-field-data="field_model">></gh-file>'
    }, {
      id: 'file_name',
      name: 'File name',
      content: ()=>
        '<gh-file field-data-model="field_model.data_model" gh-model="field_model.field_value" gh-item-id="itemId" gh-app-id="appId" gh-mode="file_name" editable="field_model.settings.editable" gh-field-data="field_model"></gh-file>'
    },{
      id: 'value',
      name: 'Value',
      content: ()=>{
        if(field_model.data_model.display_mode == 'multiple') {
          let fieldValueArray = fieldValue.split(',')
  
          return gudhub.getFiles(appId, fieldValueArray).then( files => {
              let multipleFiles = ''
  
              files.forEach( (file, index) => {
                multipleFiles += file.url + ','
              })
              return multipleFiles.slice(0,-1)
            },
            (error) => 'no image'
          );
        }
        else {
          return gudhub.getFile(appId, fieldValue).then(file => {
              return file.url
            },(error) => 'no image'
          );
        }
      }
    }];
  }
}


angular.module('filetData', [
  'fileManagerModule'
])



/*=======================================================================================================*/
/*=========================================  FILE DATA   ================================================*/
/*=======================================================================================================*/


.factory('file', ['$q', 'fileManager', function($q, fileManager) {
  const filetData = new FiletData();
  return {
    getTemplate: function () {
      return filetData.getTemplate();
    },

    filter: filetData.filter,
    
    getSettings: function (fieldSettingsScope) {
      return filetData.getSettings(fieldSettingsScope);
    },

    getInterpretation: function (gudhub, fieldValue, appId, itemId, field_model) {
      return filetData.getInterpretation(gudhub, fieldValue, appId, itemId, field_model);
    },

    

  };
}]);
