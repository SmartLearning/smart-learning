/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .constant('AppConstants', {
            FOLDER_MIME_TYPE: 'application/vnd.google-apps.folder',
            SPREADSHEET_MIME_TYPE: 'application/vnd.google-apps.spreadsheet',
            DOCUMENT_MIME_TYPE: 'application/vnd.google-apps.document',
            QUESTION_SHEET_ID: '1FqmeBTcnVTOTNeXegnXTuczrLTbqtGXh0kO5bXRej2M',
            ROOT_FOLDER_ID: '0B7TUAIgyr7KDaUw1X0c3dDlVeEU',
            API_KEY: 'AIzaSyAPv2lxveRF_vRWo8vLY4juoq40CvNDsTM'
        });

})(angular);
