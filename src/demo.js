angular.module('app', ['ngMaterial', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic'])
    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: 'dist/i18n/',
            suffix: '/angular-surveys.json'
        });
        $translateProvider.preferredLanguage('en');
    })
    .controller('DemoController', function($q,$http, $translate, mwFormResponseUtils, $scope, $timeout) {

        var ctrl = this;
        $scope.timeforAI = false
        $scope.processing = false
        $scope.submitted = "Hello world"
        $scope.finalPage = false
        ctrl.textProgress = "Please wait while we gather data from current bank employees"
        ctrl.cmergeFormWithResponse = false;
        ctrl.cgetQuestionWithResponseList = false;
        ctrl.cgetResponseSheetHeaders = false;
        ctrl.cgetResponseSheetRow = false;
        ctrl.cgetResponseSheet = false;
        ctrl.headersWithQuestionNumber = true;
        ctrl.builderReadOnly = false;
        ctrl.viewerReadOnly = false;
        ctrl.languages = ['en', 'pl', "es", 'ru'];
        ctrl.formData = null;
        $http.get('form-data.json')
            .then(function(res){
                ctrl.formData = res.data;
            });
        ctrl.usersData = null;
        ctrl.usersFinal = null
        $http.get('users.json')
            .then(function(res){
                ctrl.usersData = res.data;
                // console.log(ctrl.usersData)
                console.log(ctrl.usersData.length)
                console.log(Math.random())
                var rand = ctrl.usersData[Math.floor(Math.random() * ctrl.usersData.length)];
                var rand2 = ctrl.usersData[Math.floor(Math.random() * ctrl.usersData.length)];
                var rand3 = ctrl.usersData[Math.floor(Math.random() * ctrl.usersData.length)];
                rand.tweet = "Just wanted to share this moment.  The first time Darryl saw his future wife.  Congratulations @DarrylSmart1 on your nuptials."
                rand2.tweet = "Your Pro-Fit Chiefs would like to wish a very happy birthday to our very own #71 Brier Jonathan "
                rand3.tweet = "Throwing it back to my first Mann cup"
                ctrl.usersFinal = [rand, rand2, rand3]
                console.log(ctrl.usersFinal)
            });
        ctrl.formBuilder={};
        ctrl.formViewer = {};
        ctrl.formOptions = {
            autoStart: false,
            disableSubmit: false
        };
        ctrl.optionsBuilder={
            /*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: ctrl.callback, filter: ctrl.filter, showInOpen: true}],
            customQuestionSelects:  [
                {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
                {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
            ],
            elementTypes: ['question', 'image']*/
        };
        ctrl.formStatus= {};
        ctrl.responseData={};
        $http.get('response-data.json')
            .then(function(res){
                ctrl.responseData = res.data;
            });
            
        $http.get('template-data.json')
            .then(function(res){
                ctrl.templateData = res.data;
            });

        ctrl.showResponseRata=false;

        ctrl.saveResponse = function(){
            console.log("Hello World")
            $scope.timeforAI = false
            $scope.processing = true
            $timeout( function(){ 
                $scope.timeforAI = true
                $scope.processing = false
                angular.element("#play-pause-button").trigger( "click" );
                $timeout( function(){ 
                    ctrl.textProgress = "Please wait while we find the best Aboriginal candidates"
                    $scope.timeforAI = false
                    $scope.processing = true
                    $timeout( function(){
                        $scope.processing = false
                        $scope.finalPage = true    
                    }, 5000);
                    // angular.element("#play-pause-button"    ).trigger( "click" );
                 }, 20000);

             }, 5000);
            
        };

        ctrl.onImageSelection = function (){

            var d = $q.defer();
            var src = prompt("Please enter image src");
            if(src !=null){
                d.resolve(src);
            }else{
                d.reject();
            }

            return d.promise;
        };

        ctrl.resetViewer = function(){
            if(ctrl.formViewer.reset){
                ctrl.formViewer.reset();
            }

        };

        ctrl.resetBuilder= function(){
            if(ctrl.formBuilder.reset){
                ctrl.formBuilder.reset();
            }
        };

        ctrl.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };

        ctrl.getMerged=function(){
            return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
        };

        ctrl.getQuestionWithResponseList=function(){
            return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetRow=function(){
            return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetHeaders=function(){
            return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
        };

        ctrl.getResponseSheet=function(){
            return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
        };

    });