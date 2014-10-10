var XPush = require( './index' );
var assert = require('assert');

var xpush;

var USERS = ['user1','user2','user3','user4'];
var PASS = ['win1234','win1234','win1234','win1234'];

describe('XPUSH Client Test', function(){

	before(function(){

	  xpush = new XPush('http://demo.stalk.io:8000', 'xpush-client' );

	  xpush1 = new XPush('http://demo.stalk.io:8000', 'xpush-client' );

	});

  this.timeout(5000);

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
				assert.equal(result.status, "ok");
				done();
			});

		});

	});

});