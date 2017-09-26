/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .constant('AppConstants', {
            FOLDER_MIME_TYPE: "application/vnd.google-apps.folder",
            SPREADSHEET_MIME_TYPE: "application/vnd.google-apps.spreadsheet",
            DOCUMENT_MIME_TYPE: "application/vnd.google-apps.document",
            ROOT_FOLDER_ID: '0B7TUAIgyr7KDaUw1X0c3dDlVeEU',
            API_KEY: 'AIzaSyAPv2lxveRF_vRWo8vLY4juoq40CvNDsTM'
        });

})(angular);
