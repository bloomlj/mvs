var client={};
client.init = function(){
  //clear db
  if(!localStorage.getItem("vote"))  localStorage.setItem("vote",'');
  if(!localStorage.getItem("connect"))  localStorage.setItem("connect",'');
  if(!localStorage.getItem("userinput"))  localStorage.setItem("userinput",'{}');
  if(!localStorage.getItem("localreport"))  localStorage.setItem("localreport",'{}');
  client.connect = {server:"192.168.80.177",port:"80"};
}
client.view_login = function(){
  tplrender("login-tpl",{},"login_pagecontent");
}
client.http_login=function(connect){
  //login
  $.ajax({
    type:"GET",
    url:"http://" + connect.server + ":" + connect.port +"/vote/api_opened/"+connect.password,
    error: function(jqXHR, textStatus, errorThrown){
      $("#loginmsg").text("登录失败,错误信息：无法与服务器 "+connect.server+" 正常通信。").addClass("error").show('slow');
    },
    success: function(doc){
      if(doc.status == 'success'){
         $("#login_page").remove();
         $("#homepage").show();
        client.loadhomepage(doc.data);
      }
      if(doc.status == 'error'){
        jQuery("#loginmsg").text("登录失败。原因："+doc.info).addClass('error');
      }
    }
  });

}
// when data get ,then load home page.
client.loadhomepage=function(data){
  localStorage.setItem("vote",JSON.stringify(data));
  //show sidebar nav
  $("#sidebar").show();

//显示标题
  var template = _.template("<%= name%>");
  var htmlstr = template({name : data.name});
  //jQuery("#pagetitle").text(htmlstr);
  tplrender("section-nav-tpl",data,"pagetitle");
  $("#role").html(data.role);
  //sideber_scroll_init();
  load_section("section_0");
}


$(document).ready(function(){
  client.init();
  client.view_login();
});

function contoller_login(){
  //登入界面
    var password = $("input#loginpassword").val();
    client.connect.password = password;
    localStorage.setItem("connect",JSON.stringify(client.connect));
    if(password == ''){
      jQuery("#loginmsg").text("用户名和密码必须填写。").addClass('error');
    }
    else{
      client.http_login(client.connect);
    }
}
//显示选票表单
function load_section(section_key) {
    $("header#pagetitle  a").removeClass("active");
    $("header#pagetitle a#headerlinkto-"+section_key).addClass("active");

    var data = JSON.parse(localStorage.getItem("vote"));

    if(typeof data.sections[section_key] != "undefined"){
      data.sections[section_key].key = section_key;
      tplrender("question-nav-tpl",data.sections[section_key],"sidebarbody");

      if(data.vtype=="mark") {
        tplrender("marksection_table-tpl",data.sections[section_key],"voteform");
      }
      if(data.vtype=="vote") {
        tplrender("votesection-tpl",data.sections[section_key],"voteform");
      }  
    }

    loadsaved2homepage();
    //init content scroll
    content_scroll_init();
    //init rang input widget
    //rangeinput_init();
}

function post_conform(){
      r = confirm("确定要提交吗？提交后将不能返回修改。");
       if(r){
          rr = confirm("确定要提交吗？");
          if(rr){
            post_form();
          }
       }else{}
}
function post_form(){

   var userinput = JSON.parse(localStorage.getItem("userinput"));
   var connect = JSON.parse(localStorage.getItem("connect"));
   var votedata = JSON.parse(localStorage.getItem("vote"));

   var postdata = userinput;
   postdata["password"] = connect.password;
   postdata["vote_id"] = votedata._id;
   postdata["vtype"] = votedata.vtype;
   postdata["vote_name"] = votedata.name;
   console.log(postdata);
   $.post("http://"+connect.server+":"+connect.port+"/answer/api_create", postdata,function(msg){
      tplrender("voteresult-page-tpl",{"status":msg.status},"voteresult_pagecontent");
      //clear local db
      localStorage.setItem("vote",'');
      //localStorage.setItem("connect",'');
      localStorage.setItem("userinput",'{}');
      localStorage.setItem("localreport",'{}');
      //remove  the pages for vote
      jQuery("#homepage").remove();
      jQuery("#questioninput_page").remove();
      jQuery("#review_page").remove();
      //show voteresult page
      jQuery("#voteresult_page").show();
      var voteresult_Scroll = new iScroll('voteresult_wrapper');

   });
}


function view_questioninput(section,group,org,question){
  var vote = JSON.parse(localStorage.getItem("vote"));
  var qitem = {};
  qitem.sectionkey = section;
  qitem.groupkey = group;
  qitem.orgkey = org;
  qitem.questionkey = question;
  qitem.org = vote['sections'][section]['groups'][group]['orgs'][org];
  qitem.question = vote['sections'][section]['groups'][group]['questions'][question];
  tplrender("questioninput-tpl",qitem,"questioninput_pagecontent");
  jQuery("#homepage").hide();
  jQuery("#questioninput_page").show();
  
  loadsavedinput();

  var questioninput_page_scroller = new iScroll('questioninput_wrapper',{
  onBeforeScrollStart: function (e) {
      var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;
      if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'&& target.tagName != 'BUTTON')
        e.preventDefault();
      }
  });
}

function view_review(){
   var userinput = JSON.parse(localStorage.getItem("userinput"));
   var localanswers = tool_inputs2objwithtext(userinput)
   console.log(localanswers);
   tplrender("votereview-tpl",{"localanswers":localanswers},"review_pagecontent");

   jQuery("#homepage").hide();
   jQuery("#review_page").show();
   var reviewpage_scroller = new iScroll('review_wrapper');
}

function fetch_report(){
    var connect = JSON.parse(localStorage.getItem("connect"));
    $.ajax({
    type:"GET",
    url:"http://" + connect.server + ":" + connect.port +"/report/api_opening/"+connect.password,
    error: function(jqXHR, textStatus, errorThrown){
      //$("#loginmsg").text("登录失败,错误信息：无法与服务器 "+connect.server+" 正常通信。").addClass("error").show('slow');
    },
    success: function(doc){
      if(doc.status == 'success'){
        console.log(doc);
         tplrender("votereport-page-tpl",doc,"votereport_pagecontent");
         jQuery("#voteresult_page").hide();
         jQuery("#votereport_page").show();
         var reviewpage_scroller = new iScroll('votereport_wrapper');
       }
      if(doc.status == 'error'){
        //jQuery("#loginmsg").text("登录失败。原因："+doc.info).addClass('error');
      }
    }
  });
}
function tplrender(tpl_id,data,target_id) {
   var tplhandle = _.template(jQuery("#"+tpl_id).text());
   var htmlstr = tplhandle(data);
   jQuery("#"+target_id).html(htmlstr);
   jQuery("#"+target_id).addClass("by_"+tpl_id);
   // console.log(target_id);
   // console.log(tpl_id);
   // console.log(htmlstr);
 }

//tpl_el: tpl_element like $("xxx_id")  data: json data to bind.
function autotplrender(tpl_id,data,callback) {
   //console.log(data);
   //console.log(jQuery("#"+tpl_id).text());

   jQuery(".by_"+tpl_id).remove();
   var votenowtmp = _.template(jQuery("#"+tpl_id).text());
   var votenowstr = votenowtmp(data);
   //console.log(votenowstr);
   jQuery("#"+tpl_id).after(votenowstr);
   jQuery("#"+tpl_id).next().addClass("by_"+tpl_id);
   //callback;
 }


function rangedecrease(el) {
  var current = $(el).next().val();
  //if null,give it max value for default
  if(current == ""){
    $(el).next().val(parseInt($(el).next().attr('max')));
    saveinput($(el).next()[0]);
  }
  var min = $(el).next().attr('min');
  if(parseInt(current) > parseInt(min)) {
    console.log(parseInt(current)-1);
    $(el).next().val(parseInt(current)-1);
    saveinput($(el).next()[0]);
  }
  

  return false;
}

function rangeadd(el) {
  var current = $(el).prev().val();
  //if null,give it max value for default
  if(current == ""){
    $(el).prev().val($(el).prev().attr('max'));
    saveinput($(el).prev()[0]);
  }
  var max = $(el).prev().attr('max');
  if(parseInt(current) < max){
    $(el).prev().val(parseInt(current)+1);
    saveinput($(el).prev()[0]);
  }
  
  //if null,give it max value for default
  if(current = '') $(el).prev().val($(el).prev().attr('max'));
  return false;
}

function saveinput(el){
  var userinput = JSON.parse(localStorage.getItem("userinput"));
  //checkbox
  if("checkbox" == $(el).attr("type")){
    if("checked" == $(el).attr("checked")){
      userinput[$(el).attr("name")] = 1;
      console.log($(el).val());
    }else{
      delete userinput[$(el).attr("name")];
    }
  }
  //number
  if("number" == $(el).attr("type")){
    userinput[$(el).attr("name")] = $(el).val();
    //if is not the total field itself ,then autorefalsh it.
    if($(el).attr("name").indexOf("total") == -1)     questioninput_total_autoreflash();
    userinput[$($(".questiontotal_inputfield input")[0]).attr("name")] = $($(".questiontotal_inputfield input")[0]).val();
  }
  localStorage.setItem("userinput",JSON.stringify(userinput));

  //debug
  //console.log($(el).attr("type"));
  //console.log(userinput);
  //console.log(localStorage.getItem("userinput"));
}

function loadsavedinput(){
      //load saved cache of inputs
    var userinput = JSON.parse(localStorage.getItem("userinput"));
    $("input").each(function(i){
      if(typeof userinput[this.name] != "undefined"){
        $(this).val(userinput[this.name]);
        if( "checkbox" == $(this).attr("type")  && '1' == parseInt(userinput[this.name]) ){
          $(this).attr("checked","checked");
        }
      }
    });
}

function questioninput_total_autoreflash(){
    var subquestion_total = 0;
    
    for (var i = 0; i < $(".subquestion_inputfield  input").length; i++) {
      if($($(".subquestion_inputfield input")[i]).val() != "") subquestion_total+=parseInt($($(".subquestion_inputfield input")[i]).val());
    };
    
    $(".questiontotal_inputfield input").val(subquestion_total);
    //save total input val,because it may not be changed by person.
            //another method
    //var totalfieldkey = $(el).attr("name").replace(/subquestion_\d/, "total");
    //$("input[name='"+totalfieldkey+"']").val(subquestion_total);
}
function  subquestion_name2key(name){
    var subquestion_keyarray = name.match(/[a-z]+_\d+/g);
    //alert(subquestion_keyarray.length);
    var keys = {};
    keys['section_key'] = subquestion_keyarray[0];
    keys['group_key'] = subquestion_keyarray[1];
    keys['org_key'] = subquestion_keyarray[2];
    keys['question_key'] = subquestion_keyarray[3];
    keys['subquestion_key'] = subquestion_keyarray[4];
    return keys;
}
function tool_inputs2obj(inputs){
    var local_answers={};
    for (var key in inputs) {
        //result += objName + "." + prop + " = " + inputs[key] + "\n";
        var keyarray = key.match(/[a-z]+_\d+/g);
        if(typeof local_answers[keyarray[0]] == "undefined")    local_answers[keyarray[0]] = {};
        if(typeof local_answers[keyarray[0]][keyarray[1]] == "undefined") local_answers[keyarray[0]][keyarray[1]] = {};
        if(typeof local_answers[keyarray[0]][keyarray[1]][keyarray[2]] == "undefined") local_answers[keyarray[0]][keyarray[1]][keyarray[2]]= {};
        if(typeof local_answers[keyarray[0]][keyarray[1]][keyarray[2]][keyarray[3]] == "undefined")  local_answers[keyarray[0]][keyarray[1]][keyarray[2]][keyarray[3]]= {};
        local_answers[keyarray[0]][keyarray[1]][keyarray[2]][keyarray[3]][keyarray[4]] = inputs[key];
    }
    return local_answers;
}
function tool_inputs2objwithtext(inputs){
    var votedata = JSON.parse(localStorage.getItem("vote"));
    var local_answers={};
    for (var key in inputs) {
        //result += objName + "." + prop + " = " + inputs[key] + "\n";
        var keyarray = key.match(/[a-z]+_\d+/g);
        //init
        if(typeof local_answers[keyarray[0]] == "undefined")    local_answers[keyarray[0]] = {"groups":{}};
        if(typeof local_answers[keyarray[0]]['groups'][keyarray[1]] == "undefined") local_answers[keyarray[0]]['groups'][keyarray[1]] = {"orgs":{}};
        if(typeof local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]] == "undefined") local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]={"questions":{}};
        if(typeof local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]] == "undefined")  local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]= {"subquestions":{}};
        if(typeof local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['subquestions'][keyarray[4]] == "undefined")  local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['subquestions'][keyarray[4]]= {};
        console.log(local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['subquestions']);
        //give value
        local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['subquestions'][keyarray[4]]['answer'] = inputs[key];
        //get text
        local_answers[keyarray[0]]['title'] = votedata['sections'][keyarray[0]]['title'];
        local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['fullname'] = votedata['sections'][keyarray[0]]['groups'][keyarray[1]]['orgs'][[keyarray[2]]]['fullname'];
        local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['text'] = votedata['sections'][keyarray[0]]['groups'][keyarray[1]]['questions'][[keyarray[3]]]['text'];
        if(keyarray[4] != 'total_0')  local_answers[keyarray[0]]['groups'][keyarray[1]]['orgs'][keyarray[2]]['questions'][keyarray[3]]['subquestions'][keyarray[4]]['text'] = votedata['sections'][keyarray[0]]['groups'][keyarray[1]]['questions'][[keyarray[3]]]['subquestions'][keyarray[4]]['text'];
    }
    return local_answers;
}
function tool_inputs2answeritem(inputs){
    var votedata = JSON.parse(localStorage.getItem("vote"));
    var answeritem={};
    for (var key in inputs) {
        //result += objName + "." + prop + " = " + inputs[key] + "\n";
        var keyarray = key.match(/[a-z]+_\d+/g);
        if(keyarray[4] == 'total_0') {
          answeritem['section_key'] = keyarray[0];
          answeritem['section_title'] = votedata['sections'][keyarray[0]]['title'];
          answeritem['group_key'] = keyarray[1];
          answeritem['org_key'] = keyarray[2];
          answeritem['org_title'] = votedata['sections'][keyarray[0]]['groups'][keyarray[1]]['orgs'][[keyarray[2]]]['fullname'];
          answeritem['question_key'] = keyarray[3];
          answeritem['question_title'] = votedata['sections'][keyarray[0]]['groups'][keyarray[1]]['questions'][[keyarray[3]]]['text'];
          answeritem['total'] = inputs[key];
        }
    }
    return answeritem;
}
function questioninput_savebackto_homepage(){
  var totalfieldname = $($(".questiontotal_inputfield input")[0]).attr("name");
  var totalvalue = $($(".questiontotal_inputfield input")[0]).val();
  var keys = subquestion_name2key(totalfieldname);
  var tdid = "qgrid-"+keys['section_key']+"-"+keys['group_key']+"-"+keys['org_key']+"-"+keys['question_key'];
  $("td#"+tdid).html("已打"+totalvalue+"分");
  $("td#"+tdid).addClass("saved");

  //save the local report
  var localreport = JSON.parse(localStorage.getItem("localreport"));

  if(typeof localreport[keys['section_key']]== "undefined") localreport[keys['section_key']] = {};
  if(typeof localreport[keys['section_key']][keys['group_key']]== "undefined") localreport[keys['section_key']][keys['group_key']] = {'orgs':{}};
  if(typeof localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']]== "undefined")  localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']] = {'questions':{}};
  localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']]['questions'][keys['question_key']] = totalvalue;
  
  var orgtotalvalue = 0;
  for(qk in localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']]['questions'] ){
    orgtotalvalue+= parseInt(localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']]['questions'][qk]);
  }
  localreport[keys['section_key']][keys['group_key']]['orgs'][keys['org_key']]['total'] = orgtotalvalue;
  localStorage.setItem("localreport",JSON.stringify(localreport));
  //update the local org total
  var all_tid = "totalgrid-"+keys['section_key']+"-"+keys['group_key']+"-"+keys['org_key'];
  $("td#"+all_tid).html(orgtotalvalue+"分");
  $("td#"+all_tid).addClass("saved");

  jQuery("#questioninput_page").hide();
  jQuery("#homepage").show();
}
function loadsaved2homepage(){
  var userinput = JSON.parse(localStorage.getItem("userinput"));
  var localreport = JSON.parse(localStorage.getItem("localreport"));
  for(fieldname in userinput){
    var keys = subquestion_name2key(fieldname);
    if(keys['subquestion_key'] == "total_0"){
      var totalvalue = userinput[fieldname];
      var tdid = "qgrid-"+keys['section_key']+"-"+keys['group_key']+"-"+keys['org_key']+"-"+keys['question_key'];
      $("td#"+tdid).html("已打"+totalvalue+"分");
      $("td#"+tdid).addClass("saved");
    }

  };

  for(s in localreport){
    for(g in localreport[s]){
      for(o in localreport[s][g]['orgs']){
        orgtotalvalue = localreport[s][g]['orgs'][o]['total'];
        var all_tid = "totalgrid-"+s+"-"+g+"-"+o;
        $("td#"+all_tid).html(orgtotalvalue+"分");
        $("td#"+all_tid).addClass("saved");
      }
    }
  }
}
function review_backto_homepage(){
  jQuery("#review_page").hide();
  jQuery("#homepage").show();
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    document.addEventListener("backbutton", function(e){
       r = confirm("确定要退出吗？");
       if(r){
          rr = confirm("您真的要退出吗？");
          if(rr){
              e.preventDefault();
              navigator.app.exitApp();
          }
       }else{}
    }, false);
}
    
var debug_el = $("#debug");

function log(str) {
    debug_el.prepend(str +"<br>");
}
function rangeinput_init(){

    $(".rangeinput_widget a.rangedecrease").hammer({
        prevent_default: false,
        drag_vertical: false
    })
    .bind("hold", function(ev) {
        console.log(ev);
        log(ev.type);
        rangedecrease(ev.target);
    });
    $(".rangeinput_widget a.rangeadd").hammer({
        prevent_default: false,
        drag_vertical: false
    })
    .bind("hold", function(ev) {
        console.log(ev);
        log(ev.type);
        rangeadd(ev.target);
    });

}


function sideber_scroll_init(){
  var scrollNav = new iScroll('navWrapper',{
  onBeforeScrollStart: function (e) {
      e.preventDefault();
    }
  });
}

function content_scroll_init(){
  var scrollContent = new iScroll('contentWrapper',{
  vScroll:false,
  onBeforeScrollStart: function (e) {
      var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;
      if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'&& target.tagName != 'BUTTON')
        e.preventDefault();
      }
  });



}