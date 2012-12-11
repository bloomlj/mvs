var voteEditor = {};

voteEditor.init = function(){
  voteEditor.votedata = {"name":"xxx","vtype":"","note":""}
}

voteEditor.render = function(){
    var html = $('#vote-template').html();
    var fn = jade.compile(html);
    var html = fn(voteEditor.votedata);
    $('#setp1').html(html);
}

$(document).ready(function(){

  voteEditor.init();
  voteEditor.render();

});