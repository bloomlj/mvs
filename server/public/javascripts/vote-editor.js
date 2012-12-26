    function add_field(link,fieldtype){
      //先计算已有的字段
      var len = $(link).prevAll("."+fieldtype).length;
      console.log($(link).prev().html());
      //复制一份
      $(link).before($(link).prev().clone());


      //更新这个的所有name
      for(i = 0;i<$(link).prev().find("input").length;i++){
        name = $(link).prev().find("input")[i].name;
        if(fieldtype == 'section'){
          $(link).prev().find("input")[i].name = name.replace(fieldtype+'s'+'['+(len-1)+']',fieldtype+'s'+'['+len+']');
        }
        else{
          $(link).prev().find("input")[i].name = name.replace('['+fieldtype+'s]'+'['+(len-1)+']','['+fieldtype+'s]'+'['+len+']');
        }
      }

      event.preventDefault(); 
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
      // $("#setp2").hide();
      // $("#setp3").hide();

      $("#btn_to_setp2").click(function(){
        // $("#setp1").hide();
        // $("#setp2").show();

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

      $("#btn_to_setp3").click(function(){
        // $("#setp1").hide();
        // $("#setp2").hide();
        // $("#setp3").show();

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

      $('.modalfire').live('click', function() {
        $(this).next().modal();
      });
      

    });