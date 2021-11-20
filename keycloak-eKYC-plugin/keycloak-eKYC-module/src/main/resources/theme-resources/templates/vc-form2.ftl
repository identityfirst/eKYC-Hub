<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false displayRequiredFields=false;  section>
    <#if section = "header">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <#elseif section = "form">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.4-build.3588/angular.js" ></script>
    <style>
        #kc-username {
            display: none;
        }
    </style>

    <div ng-app="vcApp" ng-controller="vcCtrl">
        <p>Your are logged in as: {{ username }}</p>
        <p>The following information will be shared with:</p>
        <p><b>{{ appName }}</b></p>
        <table style="width: 100%;table-layout: fixed;word-wrap: break-word; border-collapse: separate;border-spacing: 0 20px;" >
            <div >
            <tr ng-repeat="(key, value) in claims">
                <td style="display: flex; flex-direction: column">
                    <div style="display: flex; flex-direction: row; justify-content: space-between">
                        <div>
                            {{value.selected.value}} </br>
                            <span style="font-size: 10px">{{ mapClaimName(key) }}</span> </br>

                        </div>
                        <div>
                            <select ng-options="v as getSourceOption(v) for v in value.options "
                                    ng-model="value.selected"
                                    ng-init="value.selected = value.options[0]">
                            </select>
                        </div>
                    </div>
                    <div>
                        <span>Purpose: {{value.purpose}}</span>
                    </div>

                </td>
            </tr>
            </div>
        </table>
        <#if notEnoughError>
                <p class="alert alert-danger">You don't have enough claims. Please add.</p>
        </#if>
        <p>Purpose for access:</p>
        <p><b>{{ purpose }}</b></p>
    <!--<form action="${url.loginAction}" class="${properties.kcFormClass!}" id="kc-u2f-login-form" method="post">-->
    <form id="selectForm" ng-submit="save()" class="${properties.kcFormClass!}" id="kc-u2f-login-form" method="post">
        <!--<input id="selected" type="hidden" name="selected"/>-->
        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}"
               type="submit" value='${msg("doSubmit")}' <#if notEnoughError>disabled </#if> />
        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}"
               type="button" value='Add more claims' onclick="window.location = '${accountUrl}'"/>
    </form>
    </div>
    <script>
        var app = angular.module("vcApp", []);
        app.controller('vcCtrl', function($scope, $http) {
            var claimPurposes = JSON.parse('${claimPurposes}'.split("&quot;").join('"'))
            var vcs = JSON.parse('${vcs}'.split("&quot;").join('"'))
            claims = {}
            vcs.forEach(vc =>{
                if(!claims[vc.name]){
                    claims[vc.name]={
                        options: [],
                        purpose: claimPurposes[vc.name] || "Not provided"
                    }
                }
                claims[vc.name].options.push(vc)
            })

            $scope.save = function (form) {
                var selectedIds = []
                for (var key in claims) {
                    selectedIds.push(claims[key].selected.id)
                }
                var url = "${url.loginAction}".split("amp;").join('');
                console.log(selectedIds)

                var form = document.getElementById("selectForm")
                form.action = url

                selectedInput = document.createElement("input");
                selectedInput.value = encodeURIComponent(JSON.stringify(selectedIds));
                selectedInput.name = "selected";

                form.appendChild(selectedInput);
                form.submit()
            }


            console.log(claims)
            $scope.claims = claims
            $scope.username = "${username}"
            $scope.appName = "${appName}"
            $scope.purpose = "${purpose}"

            $scope.mapClaimName = function (name) {
                return $scope.claimNames[name]
            }
            $scope.claimNames = {
                birthdate: "Date of birth",
                family_name: "Family name",
                given_name: "Given names",
                place_of_birth: "Place of birth",
                nationalities: "Nationalities",
                birth_family_name: "Birth family name",
                birth_given_name: "Birth given name",
                birth_middle_name: "Birth middle name",
                salutation: "Salutation",
                title: "Title",
            }

            $scope.getSourceOption = function (vc) {
                return $scope.documentType[vc.document] + " ("+vc.source+")"
            }
            $scope.documentType = {
                driving_permit: "Driving License",
                idcard: "ID Card",
                passport: "Passport",
                residence_permit: "Resident Permit",
                bank_statement: "Bank Statement",
                utility_statement: "Utility Statement",
                mortgage_statement: "Mortgage Statement"
            }
        });

    </script>
    </#if>
</@layout.registrationLayout>
