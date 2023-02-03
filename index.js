var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studDBName = "SCHOOL-DB";
var studRelationName = "STUDENT-TABLE";
var connToken = '90932224|-31949277083025334|90954324';

$('#rollNo').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getRollNoAsJsonObj(){
    var rollNo = $('#rollNo').val();
    var jsonStr = {
        rollNo : rollNo
    }
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#studName").val(record.studName);
    $("#studClass").val(record.studClass);
    $("#studDob").val(record.studDob);
    $("#studAddress").val(record.studAddress);
    $("#studEnroll").val(record.studEnroll);
}

function resetForm(){
    $('#rollNo').val("");
    $('#studName').val("");
    $('#studClass').val("");
    $('#studDob').val("");
    $('#studAddress').val("");
    $('#studEnroll').val("");
    $('#rollNo').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollNo').focus();
}


function validateData(){
    var rollNo, studName, StudClass, studDob, studAddress, studEnroll;
    studName = $('#studName').val();
    studClass = $('#studClass').val();
    studDob = $('#studDob').val();
    studAddress = $('#studAddress').val();
    studEnroll = $('#studEnroll').val();
    rollNo = $('#rollNo').val();

    if(rollNo === ""){
        alert("Student Roll No missing");
        $('#rollNo').focus();
        return "";
    }
    if(studName === ""){
        alert("Student Name missing");
        $('#studName').focus();
        return "";
    }
    if(studClass === ""){
        alert("Student Class missing");
        $('#studClass').focus();
        return "";
    }
    if(studDob === ""){
        alert("Student DOB missing");
        $('#studDob').focus();
        return "";
    }
    if(studAddress === ""){
        alert("Student Address missing");
        $('#studAddress').focus();
        return "";
    }
    if(studEnroll === ""){
        alert("Student Enrollment Date missing");
        $('#studEnroll').focus();
        return "";
    }

    var jsonStrObj = {
        rollNo : rollNo,
        studName : studName,
        studClass : studClass,
        studDob : studDob,
        studAddress : studAddress,
        studEnroll : studEnroll
    };
    return JSON.stringify(jsonStrObj);
}

function getStud(){
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studDBName, studRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async : true});
    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#rollNo').focus();
    }else if(resJsonObj.status === 200){
        $("#rollNo").prop('disabled', true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#studName").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studDBName, studRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollNo').focus();
}

function updateData(){
    $('#update').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studDBName, studRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async : true});
    console.log(resJsonObj);
    resetForm();
    $('#rollNo').focus();
}