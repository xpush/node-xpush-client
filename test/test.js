var XPush = require( '../index' );
var assert = require('assert');

var xpush, xpush1, xpush2;

var USERS = ['user1','user2','user3','user4'];
var PASS = ['win1234','win1234','win1234','win1234'];

var appId = 'xpush-client';

// Clear mongoDB
var mongo = require('../node_modules/mongodb');

var host = 'demo.stalk.io';
var client;

describe('XPUSH Client Test', function(){

  before(function(){

    xpush = new XPush('http://'+host+':8000', appId );

    xpush1 = new XPush('http://'+host+':8000', appId );

    // Login lately
    xpush2 = new XPush('http://'+host+':8000', appId );

    var server = new mongo.Server(host, 27017, {auto_reconnect: true});
    var db = new mongo.Db('xpush', server);

    db.open(function(err, db) {
      if(!err) {
        client = db;
      }
    });

  });


  after(function(){


    client.collection('users', function( err, c ) {
      c.remove({'A':appId}, {safe:true}, function(err, result) {
        if (err) {
          console.log('An error has occurred - ' + err);
        } else {
          assert.equal(err, null); 
        }
      });
    });

    client.collection('channels', function( err, c ) {
      c.remove({'A':appId}, {safe:true}, function(err, result) {
        if (err) {
          console.log('An error has occurred - ' + err);
        } else {
          assert.equal(err, null);  
        }
      });
    });

    client.collection('unreadmessages', function( err, c ) {
      c.remove({'A':appId}, {safe:true}, function(err, result) {
        if (err) {
          console.log('An error has occurred - ' + err);
        } else {
          assert.equal(err, null); 
        }
      });
    });

  });

  this.timeout(10000);

  describe("#Signup Users", function() {

    // /user/register
    it("signup user1", function(done) {
      xpush.signup(USERS[0],PASS[0], function(err, data){
        if( typeof data == 'object'&& data.status ){
          assert.equal(data.status, "ok");
        } else {
          assert.equal(data, "ERR-USER_EXIST"); 
        }
        done();
      });
    });

    it("signup user2", function(done) {
      xpush.signup(USERS[1],PASS[1], function(err, data){
        if( typeof data == 'object'&& data.status ){
          assert.equal(data.status, "ok");
        } else {
          assert.equal(data, "ERR-USER_EXIST"); 
        }
        done();
      });
    });

    it("signup user3", function(done) {
      xpush.signup(USERS[2],PASS[2], function(err, data){
        if( typeof data == 'object'&& data.status ){
          assert.equal(data.status, "ok");
        } else {
          assert.equal(data, "ERR-USER_EXIST"); 
        }
        done();
      });
    });

  });

  describe("#Login Users", function() {
    var serverUrl;
    // auth, node
    it("login user1", function(done) {
      xpush.login(USERS[0],PASS[0],function(err, data){
        serverUrl = data.serverUrl;
        assert.equal( USERS[0], data.user.U );
        done();
      });
    });

    it("check node", function(done) {
      assert.equal( "http://demo.stalk.io:9000", serverUrl );
      done();
    });

    it("login user2", function(done) {
      xpush1.login(USERS[1],PASS[1],function(err, data){
        assert.equal( USERS[1],  data.user.U );
        done();
      });
    });

  });

  describe("#Users Test", function() {

    // `user-query`
    it("Query user", function(done) {
      var param = {query : {'U':'user1'}, column: { U: 1, DT: 1, _id: 0 } };
      xpush.queryUser( param, function( err, userArray, count ){
        done();
      });
    });

  });

  var randomChannel;
  describe("#Channel Create Test", function() {

    // `channel-create`
    it("create random channel without data", function(done) {

      xpush.createChannel(['user1'], function(err, data){
        randomChannel = data;
        assert.equal(err, undefined);
        done();
      });

    });

    it("create custom channel without data", function(done) {

      xpush.createChannel(['user1', 'user2'], 'channel01', function(err, data){
        assert.equal( data, 'channel01' );
        done();
      });

    });

    it("create a channel with data", function(done) {

      xpush.createChannel(['user1', 'user2'], 'channel02', {'NM':'channelName02'}, function(err, data){
        assert.equal( USERS.U, data.U );
        done();
      });

    });

  });

  describe("#Channel Manage Test", function() {

    // `channe-update`
    it("Update Channel", function(done) {

      xpush.updateChannel( 'channel02', { $set:{'DT':{'NM':'updateChannelName03'}}}, function(err, result){
        assert.equal( 'updateChannelName03', result.DT.NM );
        done()
      });

    });

    // `channel-exit`
    it("Exit Channel", function(done) {

      xpush.exitChannel(randomChannel, function(err, data){
        assert.equal(err, undefined);
        done();
      });

    });

    // `channel-list`
    it("Get Channels", function(done) {

      xpush.getChannels(function(err, datas){
        assert.equal( 2, datas.length );
        done();
      });

    });

    // `channel-join`
    it("Join Channel", function(done) {

      xpush.joinChannel( 'channel01', {'U':['user3']}, function(result){

        // `channel-get`
        xpush.getChannelData( 'channel01', function(err, result){
          assert.equal(3, result.US.length);
          done();
        });
      });

    });

  });

  describe("#Group Manage Test", function() {

    it("addUserToGroup", function(done) {

      //emit `group-add`
      xpush.addUserToGroup( 'user1', ['user2','user3'], function( err, result ){

        // Get group user by emitting `group-list`
        xpush.getGroupUsers( 'user1', function( err, result ){
          assert.equal( 2,  result.length );
          done();
        });
      });

    });

    it("removeUserFromGroup", function(done) {

      // emit `group-remove`
      xpush.removeUserFromGroup( 'user1', 'user2', function( err, result ){

        // Get group user by emitting `group-list`
        xpush.getGroupUsers( 'user1', function( err, result ){
          assert.equal( 1,  result.length );
          done();
        });
      });

    });

  });

  describe("#Message Test", function() {

    it("send message", function(done) {

      xpush.on( 'message', function( ch, name, data ){
        assert.equal(data.MG, 'Hello world');
        checkComplete();
      });

      xpush1.on( 'message', function( ch, name, data ){
        assert.equal(data.MG, 'Hello world');
        checkComplete();
      });

      //send
      xpush.send( 'channel01', 'message', {'MG':'Hello world'} );

      var count = 2;
      var checkComplete = function(){       
        --count; 
        if( !count) {
          done();
        }
      };

    });

    it("unread message user3", function(done) {
      // `message-unread`, `message-received`
      xpush2.on( 'message', function( ch, name, data ){
        assert.equal(data.MG, 'Hello world');
        checkComplete();
      });

      // retrieve unread message when login
      xpush2.login(USERS[2],PASS[2],function(err, data){
        assert.equal( USERS[2],  data.user.U );
        checkComplete();
      });

      var count = 2;
      var checkComplete = function(){       
        --count; 
        if( !count) {
          done();
        }
      };
      
    });

  });

  describe("#Upload file", function() {

    var uploadResult;

    it("Upload file with rest api", function(done) {
      var options = { name: 'sample.png' };

      // Upload file with rest api
      xpush.uploadFile( 'channel01', 'sample.png', options,
        function( data ){
          uploadResult = JSON.parse(data).result;
          assert.equal('ok', JSON.parse(data).status); 
          done();
        }
      );

    });

    it("Get file url for download", function(done) {
      var url = xpush.getFileUrl( uploadResult.channel, uploadResult.name );
      assert.ok(url);
      done();
    });
  });

});
