
    $(document).ready(function(){


      $("#ui-open-vote-add-panel").click(function(){
        $('#mark-add-panel').hide();
        $('#vote-add-panel').show();
      });

      $("#ui-open-mark-add-panel").click(function(){
        $('#vote-add-panel').hide();
        $('#mark-add-panel').show();
      });

      $("#ui-add-more-target").click(function(){
        $('#target-input').append('<input name="target[]"" type="text" placeholder="候选人" list="targets" /><br/>')
      });
      $("#ui-add-more-index").click(function(){
        $('#index-input').append('<input name="index[]" type="text" placeholder="评价指标" list="indexes" /><input name="weight[]" type="number" name="points" min="1" max="100" placeholder="比重"  />%<br/>')
      });

      $.getJSON("/orgs.json", function(data){
        //alert("JSON Data: " + data.docs[0]._id);
        var t = "";
        for(var i =0; i< data.docs.length;i++){
          t+="<option value='" + data.docs[i].name +"' label=" + data.docs[i].name + " />" ;
        }
        t += "";
        $("#orgs").html(t);
      });

      $.getJSON("/targets.json", function(data){
        //alert("JSON Data: " + data.docs[0]._id);
        var t = "";
        for(var i =0; i< data.docs.length;i++){
          t+="<option value='" + data.docs[i].name +"' label=" + data.docs[i].name + " />" ;
        }
        t += "";
        $("#targets").html(t);
      });


      $.getJSON("/indexes.json", function(data){
        //alert("JSON Data: " + data.docs[0]._id);
        var t = "";
        for(var i =0; i< data.docs.length;i++){
          t+="<option value='" + data.docs[i].name +"' label=" + data.docs[i].name + " />" ;
        }
        t += "";
        $("#indexes").html(t);
      });

    });