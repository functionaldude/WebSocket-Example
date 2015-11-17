var config   = require('../config.js');
var messages = require('../messages.js');
var WebSocketServer = require('ws').Server;

var network = {};
network.onMessage = undefined;
network.onConnectionChanged = undefined;
network.connections = {};
network.nextFreeConnectionId = 1;
network.connectionCount = function() { return Object.keys(network.connections).length };

/**
 * sendMulticast sends a multicast in the network
 *
 * @param receivers, array of connection ids, of clients to recieve the message
 * @param msg the message
 *
 * Student TODO (Task: Server Network): send message to all receivers
 */
network.sendMulticast = function(receivers, msg)
{
    receivers.forEach(function(id){
        network.connections[id].send(msg);
    })
};

/**
 * sendBroadcast sends a broadcast in the network
 *
 * @param msg the message
 *
 * Student TODO (Task: Server Network): send message to all
 */
network.sendBroadcast = function(msg)
{
    network.sendMulticast(Object.keys(network.connections), msg);
};

network.wss = new WebSocketServer({ port:config.server.wsport });
network.wss.on('error', function(err) { console.error('WebSocketServer error: ' + err) });

/**
 * Student TODO (Task: Server Network): implement server network behaviour on a new client connection
 *              1. New connection object and its functions
 *                 - give out new id,
 *                 - connection.close: closing the websocket
 *                 - connection.send: function(type, msg) signature, create netMsg, send serialized message over ws.
 *              2. Add connection
 *              3. Set appropriate connection state
 *              4. Implement websocket behaviour:
 *                 ws.on('message', function onMessage(msg){...}) by reporting to app
 *                 ws.on('close', function onClose(code, msg){...}) by notifying change
 *                 ws.on('error', function onError(err){...}) by notifying change
 */
network.wss.on('connection', function (ws)
{
    console.log('client connected');

    var connId = network.nextFreeConnectionId++;

    var connObj = {
        "id" : connId,
        close : function(){
            ws.close();
            console.log('client '+connId+' disconnected');
        },
        send : function(msg){
            ws.send(JSON.stringify(msg));
        }
    };

    network.onConnectionChanged("Connected", connObj);

    ws.on('close', function (){
        network.onConnectionChanged("Disconnected", connObj);
    });

    ws.on('error', function (){
        network.onConnectionChanged("Disconnected", connObj);
    });

    ws.on('message', function(msg){
        network.onMessage(connObj, JSON.parse(msg));
    });


});

exports.network = network;




