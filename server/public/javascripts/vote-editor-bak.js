    function add_field(link,fieldtype){
      //先计算已有的字段
      var len = $(link).prevAll("fieldset."+fieldtype).length;
      //复制一份
      $(link).before($(link).prev().clone());

      //alert($(link).prev().find("input").length);
      //alert(len);
      //更新这个的所有name
      for(i = 0;i<$(link).prev().find("input").length;i++){
        name = $(link).prev().find("input")[i].name;
        //alert(name);
        if(fieldtype == 'section'){
          $(link).prev().find("input")[i].name = name.replace(fieldtype+'s'+'['+(len-1)+']',fieldtype+'s'+'['+len+']');
        }
        else{
          $(link).prev().find("input")[i].name = name.replace('['+fieldtype+'s]'+'['+(len-1)+']','['+fieldtype+'s]'+'['+len+']');
        }
      }

    }

    function remove_field(link){
          //$(link).prev().val(1);
          //$(link).parent().hide('slow');
          $(link).parent().remove();  
          //update_count(link);
    }

    function update_count(link){
         var len = $(this).siblings("fieldset").length;
         //alert(len);
         $(".count").text(len);
          //$(this).parent().next(".maxcandidate").find("span.countcandidate").text(len);
          //$(this).parent().next(".maxcandidate").find("input").val(len).attr("max",len);
          //$(this).parent().next().next(".mincandidate").find("input").attr("max",len);
    }

    $(document).ready(function(){
      $("#setp2").hide();
      $("#setp3").hide();
      $(".group").hide();


     // $(".section").hide();
     // $(".forvote").hide();
     // $(".formark").hide();

      $("#btn_to_setp2").click(function(){
        $("#setp1").hide();
        $("#setp2").show('slow');

        if($("#vtype").val() != 'vote'){
          $(".forvote").hide();
          $(".forvote input").val('');
          $(".formark").show();
        }
        if($("#vtype").val() != 'mark'){
          $(".formark").hide();
          $(".formark input").val('');
          $(".forvote").show();
        }
      });

      $(".add-candidates").click(function(){

        $($(this).attr("href")).show();
        $("#candidates-section-0").show();
      });


      onload = function(){
      var html = document.getElementById('pet-template').innerHTML;
      var fn = jade.compile(html);
      var locals = { pet: { name: 'Tobi', species: 'Ferret', age: 2, siblings: ['Loki', 'Jane'] }};
      var html = fn(locals);
      document.getElementById('pets').innerHTML = html;
    };


    });