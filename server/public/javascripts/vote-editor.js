var vote = {};


vote.init = function(){
  vote.votedata = {name:"",vtype:"",note:"",sections:[],isopen:'no'}
}

vote.section_add = function(sections_array){
  sections_array.push({title:"",subtitle:"",groups:[]});
}
vote.section_group_add = function(groups_array){
  groups_array.push({title:"",max:"",min:"",candidates:[],questions:[],orgs:[]});
}
vote.section_group_candidate_add = function(candidates_array){
  candidates_array.push({org:"",name:""});
}
vote.section_group_question_add = function(questions_array){
  questions_array.push({text:"",weight:"",subquestions:[]});
}
vote.section_group_question_subquestion_add = function(subquestions_array){
  subquestions_array.push({text:"",weight:""});
}
vote.section_group_orgs_add = function(orgs_array){
  orgs_array.push({fullname:"",code:""});
}

vote.render = function(){
    var tpl = $('#vote-template').html();
    console.log(tpl);
    var fn = jade.compile(tpl);
    var htmlstr = fn(vote);
    console.log(htmlstr);
    $('#forminner').html(htmlstr);
}

vote.render_sections = function(){
    var tpl = $('#section-template').html();
    console.log(tpl);
    var fn = jade.compile(tpl);
    var htmlstr = fn(vote);
    console.log(htmlstr);
    $('#sections').html(htmlstr);
}

$(document).ready(function(){

  vote.init();
  vote.render();


  $("#to_setp2").click(function(){
    vote.section_add(vote.votedata.sections);
    vote.render_sections();
  });

  
});


