var client={};
client.init = function(){
  //clear db
  if(!localStorage.getItem("vote"))  localStorage.setItem("vote",'');
  if(!localStorage.getItem("connect"))  localStorage.setItem("connect",'');
  if(!localStorage.getItem("userinput"))  localStorage.setItem("userinput",'{}');
  client.connect = {server:"192.168.1.8",port:"80"};
}
client.view_login = function(){
  tplrender("login-tpl",{},"voteform");
}
client.contoller_login = function(){
  //登入界面
  jQuery("#login #loginnow").bind('click',client,function(){
    var password = $("input[name='password']").val();
    client.connect.password = password;
    localStorage.setItem("connect",JSON.stringify(client.connect));
    if(password == ''){
      jQuery("#login #loginmsg").text("用户名和密码必须填写。").addClass('error').show('slow');
    }
    else{
      client.http_login(client.connect);
    }
  });
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
         $("#login").remove();
        client.loadhomepage(doc.data);
      }
      if(doc.status == 'error'){
        jQuery("#loginmsg").text("登录失败。原因："+doc.info).addClass('error').show('slow');
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
  //sideber_scroll_init();
  load_section("section_0");
}


$(document).ready(function(){
  client.init();
  client.view_login();
  client.contoller_login();
});


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
    //init content scroll
    content_scroll_init();
    //init rang input widget
    rangeinput_init();
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
      tplrender("voteresult-tpl",{"status":msg.status});
      jQuery("#voteform").remove();
      jQuery("#sidebar").remove();
      jQuery("header a").remove();
      jQuery("#vote_result_msg").addClass("success_msg");
      jQuery(".by_votereview-tpl").remove();  
   });
   
}

function view_questioninput(section,group,org,question){
  console.log(section);
  console.log(group);
  console.log(org);
  console.log(question);
  var vote = JSON.parse(localStorage.getItem("vote"));
  console.log(vote.sections[section]);
  console.log(vote['sections'][section]['groups'][group]['questions'][question]);
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
}
function controller_backto_homepage(){
  jQuery("#questioninput_page").hide();
  jQuery("#homepage").show();
}
function review(){

   var userinput = JSON.parse(localStorage.getItem("userinput"));
   var connect = JSON.parse(localStorage.getItem("connect"));
   var votedata = JSON.parse(localStorage.getItem("vote"));

   console.log(userinput);
   tplrender("votereview-tpl",{"inputs":userinput});

  jQuery("#voteform").hide();
  jQuery("#sidebar").hide();
  jQuery("header a").hide();
   
}
function canceltohome(){
  jQuery("#voteform").show();
  jQuery("#sidebar").show();
  jQuery("header a").show();
  jQuery(".by_votereview-tpl").remove();  
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
  var min = $(el).next().attr('min');
  if(current > min) {
    $(el).next().val(current-1);
    saveinput($(el).next()[0]);
  }
  return false;
}

function rangeadd(el) {
  var current = $(el).prev().val();
  var max = $(el).prev().attr('max');
  if(parseInt(current) < max){
    $(el).prev().val(parseInt(current)+1);
    saveinput($(el).prev()[0]);
  }
  
  return false;
}

function saveinput(el){
  var userinput = JSON.parse(localStorage.getItem("userinput"));
  //checkbox
  if("checkbox" == $(el).attr("type")){
    if("checked" == $(el).attr("checked")){
      //userinput[$(el).attr("name")] = $(el).val();
      userinput[$(el).attr("name")] = 1;
      console.log($(el).val());
    }else{
      delete userinput[$(el).attr("name")];
    }
  }
  //number
  if("number" == $(el).attr("type")){
      userinput[$(el).attr("name")] = $(el).val();
  }
  localStorage.setItem("userinput",JSON.stringify(userinput));

  //debug
  // console.log($(el).attr("type"));
  console.log(userinput);
   // console.log(localStorage.getItem("userinput"));
  // console.log($(el).attr("checked"));

}



document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    document.addEventListener("backbutton", function(e){
       r = confirm("确定要退出吗？如果你尚未提交数据，退出后丢失所有数据输入。");
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

  // var scrollContentBody = new iScroll('contentbodyScroller',{
  // onBeforeScrollStart: function (e) {
  //     var target = e.target;
  //     while (target.nodeType != 1) target = target.parentNode;
  //     if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'&& target.tagName != 'BUTTON')
  //       e.preventDefault();
  //     }
  // });

}