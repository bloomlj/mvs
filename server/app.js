
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , vote = require('./routes/vote')
  , org = require('./routes/org')
  , answer = require('./routes/answer')
  , candiate = require('./routes/candiate')
  , bullot = require('./routes/bullot')
  , voter = require('./routes/voter')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/images/photos'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);


app.get('/vote.:format?', vote.list);
app.get('/vote/add', vote.add);
app.get('/vote/addvote', vote.addvote);
app.get('/vote/addmark', vote.addmark);
app.get('/vote/:id/edit', vote.edit);
app.get('/vote/api_opened/:login/:password', vote.api_opened);
app.get('/vote/:id/result.:format?', vote.result);
//app.get('/vote/:id.:format?', vote.show);
app.get('/vote/:id/destroy', vote.destroy);
app.post('/vote', vote.create);
app.put('/vote/:id', vote.update);

//api api_opened



app.get('/org.:format?', org.list);
app.get('/org/add', org.add);
app.get('/org/:id', org.show);
app.get('/org/:id/edit', org.edit);
app.get('/org/:id/destroy', org.destroy);
app.post('/org', org.create);
app.put('/org/:id', org.update);

app.get('/bullot.:format?', bullot.list);
app.get('/bullot/add/in/:vote_id', bullot.add);
app.get('/bullot/:id', bullot.show);
app.get('/bullot/:id/edit', bullot.edit);
app.get('/bullot/:id/destroy', bullot.destroy);
app.post('/bullot', bullot.create);
app.put('/bullot/:id', bullot.update);


app.get('/answer.:format?', answer.list);
app.get('/answer/add', answer.add);
app.get('/answer/:id', answer.show);
app.get('/answer/:id/edit', answer.edit);
app.get('/answer/:id/destroy', answer.destroy);
app.post('/answer/api_create', answer.api_create);
app.post('/answer', answer.create);
app.put('/answer/:id', answer.update);

app.get('/candiate.:format?', candiate.list);
app.get('/candiate/add', candiate.add);
app.get('/candiate/:id', candiate.show);
app.get('/candiate/:id/edit', candiate.edit);
app.get('/candiate/:id/destroy', candiate.destroy);
app.post('/candiate', candiate.create);
app.put('/candiate/:id', candiate.update);

app.get('/voter.:format?', voter.list);
app.get('/voter/add', voter.add);
app.get('/voter/:id', voter.show);
app.get('/voter/:id/edit', voter.edit);
app.get('/voter/:id/destroy', voter.destroy);
app.post('/voter', voter.create);
app.put('/voter/:id', voter.update);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
