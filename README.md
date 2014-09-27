node-xpush-client
=================

xpush client for node.js

This is almost the same with xpush javascript library in [lib-xpush-web](https://github.com/xpush/lib-xpush-web)

##Installation

```bash
$ npm install xpush-client
```

##Usage Examples

```
var XPush = require( 'xpush-client );

var xpush = new XPush('http://demo.stalk.io:8000', 'demo' );

xpush.createSimpleChannel('channel01', function(){

	// `message` event listener
	xpush.on( 'message', function(channel, name, data){
		console.log( data ); // This will display message, Hello world
	});

	/**
   * @param {string} channel - Channel Id
   * @param {string} name - event name `message`
   * @param {string} mag - message to send
	 */  
	xpush.send( 'channel01', 'message', 'Hello world' );
});

```

##Documentation

http://xpush.github.io/doc/library/javascript/