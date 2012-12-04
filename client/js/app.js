$(document).ready(function(){

  //clear db
  localStorage.setItem("vote",'');
  localStorage.setItem("connect",'');
  localStorage.setItem("userinput",'{}');
  //ajax test
  var connect={server:"192.168.80.177",port:"80"};

  //for test use

  connect.login = 'lijun';
  connect.password = 'lj1984';
  //for test use end

  localStorage.setItem("connect",JSON.stringify(connect));

//for test use
  login_load(connect);
  //for test use end

  //登入界面
  jQuery("#loginnow").bind('click',connect,function(){

    //var formstr = $("form#voteform").serialize();
    var login = $("input[name='login']").val();
    var password = $("input[name='password']").val();
    var connect = JSON.parse(localStorage.getItem("connect"));
    connect.login = login;
    connect.password = password;
    localStorage.setItem("connect",JSON.stringify(connect));
    //localStorage.setItem("votedata_str", "login="+login+"&password="+password);
    if(login == '' || password == ''){
      jQuery("p.intro").text("用户名和密码必须填写。").addClass('error').show('slow');
    }
    else{
      login_load(connect);
    }

  });

});


function login_load(connect){
  //login
  $.ajax({
    type:"GET",
    url:"http://" + connect.server + ":" + connect.port +"/vote/api_opened/"+connect.login+"/"+connect.password,
    error: function(jqXHR, textStatus, errorThrown){
      $("p.intro").text("登录失败,错误信息：无法与服务器 "+connect.server+" 正常通信。").addClass("error").show('slow');
    },
    success: function(doc){
      if(doc.status == 'success'){
        loadhome(doc.data);
      }
      if(doc.status == 'error'){
        jQuery("p.intro").text("登录失败。原因："+doc.info).addClass('error').show('slow');
      }
    }
  });

}

// when data get ,then load home page.
function loadhome(data){

  localStorage.setItem("vote",JSON.stringify(data));
  //move login form
  jQuery("#login").remove();
  //show sidebar nav
  $("#sidebar").show();

//显示标题
  var template = _.template("<%= name%>");
  var htmlstr = template({name : data.name});
  jQuery("#pagetitle").text(htmlstr);

//显示基本信息
  var welcometmp = _.template("本次会议共有选票单<%= sectioncount%>个。");
  var welcomestr = welcometmp({sectioncount : data.sections.length});
  jQuery("p.intro").text(welcomestr);

  load_sidenav(data);
  load_ballot(0);

  var scrollNav = new iScroll('navWrapper',{
    onBeforeScrollStart: function (e) {
      e.preventDefault();
    }
  });
  
  var scrollContent = new iScroll('contentWrapper',{
    onBeforeScrollStart: function (e) {
    var target = e.target;
    while (target.nodeType != 1) target = target.parentNode;

    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'&& target.tagName != 'BUTTON')
      e.preventDefault();
    }
  });
}

function load_sidenav(data){
  tplrender("sidenav-tpl",data);

}

//显示选票表单
function load_ballot(count) {
   
    var data = JSON.parse(localStorage.getItem("vote"));

    //count is a temp var to count the sections array ,so when the value is larger than the array length,STOP RENDER.
    if(count < data.sections.length && count >= 0){
      //jQuery("#votenow").siblings('.ui-btn-inner').children('.ui-btn-text').text("下一单");
      data.sections[count].count = count;
      if(count > 0 ) jQuery("div#section-"+(count -1)).remove();
      if(data.vtype=="mark") {
        tplrender("marksection-tpl",data.sections[count]);
      }
      if(data.vtype=="vote") {
        tplrender("votesection-tpl",data.sections[count]);
      }
      

      data.count +=1;


    }else{ }
    //load datasaved
    var userinput = JSON.parse(localStorage.getItem("userinput"));
    //console.log(userinput);
    $("input").each(function(i){
      //console.log($(this).val());
      //console.log(userinput[this.name]);
      if(typeof userinput[this.name] != "undefined"){
        $(this).val(userinput[this.name]);
        if( "checkbox" == $(this).attr("type")  && '1' == parseInt(userinput[this.name]) ){
          $(this).attr("checked","checked");
        }
      }

    });


}


function post_form(){

   var userinput = JSON.parse(localStorage.getItem("userinput"));
   var connect = JSON.parse(localStorage.getItem("connect"));
   var votedata = JSON.parse(localStorage.getItem("vote"));

   var postdata = userinput;
   postdata["login"] = connect.login;
   postdata["password"] = connect.password;
   postdata["vote_id"] = votedata._id;
   postdata["vtype"] = votedata.vtype;
   postdata["vote_name"] = votedata.name;
   console.log(postdata);
   $.post("http://"+connect.server+":"+connect.port+"/answer/api_create", postdata,function(msg){
      alert(msg.status);
      tplrender("voteresult-tpl",{"status":msg.status});
      jQuery("#voteform").remove();
   });
   
}

//tpl_el: tpl_element like $("xxx_id")  data: json data to bind.
 function tplrender(tpl_id,data,callback) {

    jQuery(".by_"+tpl_id).remove();
    var votenowtmp = _.template(jQuery("#"+tpl_id).text());
    var votenowstr = votenowtmp(data);
   jQuery("#"+tpl_id).after(votenowstr);
   jQuery("#"+tpl_id).next().addClass("by_"+tpl_id);
   callback;
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
       r = confirm("确定要退出吗？");
       if(r){
        e.preventDefault();
        navigator.app.exitApp();
       }else{}
    }, false);
}