      $().ready(function() {
        $.getJSON("/orgs.json", function(data){
          var t = "";
          for(var i =0; i< data.docs.length;i++){
            t+="<option value='" + data.docs[i]._id +"' label=" + data.docs[i].name + " />" ;
          }
          t += "";
          $("#orgall").html(t);

          $('#add').click(function() {
           return !$('#orgall option:selected').remove().appendTo('#orgselected');
          });
          $('#remove').click(function() {
            return !$('#orgselected option:selected').remove().appendTo('#orgall');
          });
        });



          $('.vote_add_index_ab').live('click',function() {
            $(this).prev().prev().clone().insertBefore(this);
            $(this).prev().prev().clone().insertBefore(this);
            return false;
          });

          $('#vote_add_indexa').live('click',function() {
            var count = $(this).parent().siblings().length;
            var newida = "index_"+count+'a';
            var newitem = '<li><p><input name="'+newida+'" type="text" placeholder="一级指标" class="indexa"><input name="'+newida+'_weight" type="number" min="1" max="100" placeholder="比重" class="indexa-weight"></p><p><input name="'+newida+'b[]" type="text" placeholder="二级指标" class="indexb"><input name="'+newida+'b_weight[]" type="number" min="1" max="100" placeholder="比重" class="indexb-weight"><a href="#indexab" class="vote_add_index_ab btn">添加更多二级指标</a></p></li>';
            
            //添加1级指标输入
            return !$(this).parent().before(newitem);
          });

          $('#savebtn').live('click',function() {
            var vote = {};
            vote.name = $("input#name").val();
            vote.note = $("textarea#note").val();

            //get orgs select
            vote.orgs = new Array();
            var orgselected = $("select#orgselected option");
            for (var i = 0; i < orgselected.length; i++) {
              var _id = $(orgselected[i]).val();
              var name = $(orgselected[i]).attr('label');
              vote.orgs.push({'name':name,'_id':_id});
            };
            //alert(vote.orgs[0].name);

            //get index tpl 
            var indexa_els = $("input.indexa");
            var indexa-weight_els = $("indexa-weight");
            



            

            //alert($("select#orgselected option").length);
            //console.log(vote.toString());
            return false;
          });



      });



