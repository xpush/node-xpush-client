var XPush = require( './index' );

xpush = new XPush('http://stalk-front-s01.cloudapp.net:8000', 'messengerx' );

xpush.enableDebug();

setTimeout( function() {
	xpush.login( 'suzie', '1234', 'ionic', function (err, data){
		console.log( data );
	});
}, 500 );
