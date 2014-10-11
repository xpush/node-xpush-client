var XPush = require( '../index' );
var assert = require('assert');

var xpush, xpush1, xpush2;

var USERS = ['user1','user2','user3','user4'];
var PASS = ['win1234','win1234','win1234','win1234'];

describe('XPUSH Client Test', function(){

	before(function(){

	  xpush = new XPush('http://demo.stalk.io:8000', 'xpush-client' );

	  xpush1 = new XPush('http://demo.stalk.io:8000', 'xpush-client' );

	  // Login lately
	  xpush2 = new XPush('http://demo.stalk.io:8000', 'xpush-client' );

	});

  this.timeout(10000);

	describe("#Signup Users", function() {
		console.log('\n\n- - - - - - - - -');

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
		console.log('\n\n- - - - - - - - -');

    it("login user1", function(done) {
    	xpush.login(USERS[0],PASS[0],function(err, data){
    		assert.equal( USERS[0], data.user.U );
    		done();
    	});
    });

    it("login user2", function(done) {
    	xpush1.login(USERS[1],PASS[1],function(err, data){
    		assert.equal( USERS[1],  data.user.U );
    		done();
    	});
    });

	});

	describe("#Users Test", function() {
		console.log('\n\n- - - - - - - - -');

    it("Query user", function(done) {
    	var param = {query : {'U':'user1'}, column: { U: 1, DT: 1, _id: 0 } };
			xpush.queryUser( param, function( err, userArray, count ){
    		done();
    	});
    });

	});

	var randomChannel;
	describe("#Channel Create Test", function() {
		console.log('\n\n- - - - - - - - -');

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
		console.log('\n\n- - - - - - - - -');

		it("Update Channel", function(done) {

    	xpush.updateChannel( 'channel02', { $set:{'DT':{'NM':'updateChannelName03'}}}, function(err, result){
    		assert.equal( 'updateChannelName03', result.DT.NM );
    		done()
     	});

		});

		it("Exit Channel", function(done) {

			xpush.exitChannel(randomChannel, function(err, data){
				assert.equal(err, undefined);
				done();
			});

		});

		it("Get Channels", function(done) {

			xpush.getChannels(function(err, datas){
				assert.equal( 2, datas.length );
				done();
			});

		});

		it("Join Channel", function(done) {

    	xpush.joinChannel( 'channel01', {'U':['user3']}, function(result){
	    	xpush.getChannelData( 'channel01', function(err, result){
					assert.equal(3, result.US.length);
					done();
				});
			});

		});

	});

	describe("#Group Manage Test", function() {
		console.log('\n\n- - - - - - - - -');

		it("addUserToGroup", function(done) {

    	xpush.addUserToGroup( 'user1', ['user2','user3'], function( err, result ){
    		xpush.getGroupUsers( 'user1', function( err, result ){
	    		assert.equal( 2,  result.length );
	    		done();
    		});
     	});

		});

		it("removeUserFromGroup", function(done) {

    	xpush.removeUserFromGroup( 'user1', 'user2', function( err, result ){
    		xpush.getGroupUsers( 'user1', function( err, result ){
	    		assert.equal( 1,  result.length );
	    		done();
    		});
     	});

		});

	});

	describe("#Message Test", function() {
		console.log('\n\n- - - - - - - - -');

		it("send message", function(done) {

			xpush.on( 'message', function( ch, name, data ){
        assert.equal(data.MG, 'Hello world');
        checkComplete();
			});

			xpush1.on( 'message', function( ch, name, data ){
        assert.equal(data.MG, 'Hello world');
        checkComplete();
			});

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

    	xpush2.on( 'message', function( ch, name, data ){
				assert.equal(data.MG, 'Hello world');
				checkComplete();
    	});

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
});
