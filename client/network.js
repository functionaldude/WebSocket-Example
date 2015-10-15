var network = {};
network.nextFreeConnectionId = 0; // zählt einfach hoch, nur zum Debuggen
network.onConnectionChanged = undefined;
network.connection = {};
network.connection.send = function() { throw new Error("Websocket never opened") };
network.connection.close = function() { /* nothing to do */ };
/**
 * network.connect network connection functionality
 *
 * @param url websocket Url
 *
 * Student TODO (Task: Client Network):
 *              1. Open WebSocket
 *              2. Set appropriate network state
 *              3. Define appropriate websocket events
 *                 - onopen: provide connection id, connection.close, connection.send (similar to server),
 *                   set appropriate state
 *                 - onmessage: parse and report to app
 *                 - onclose: set appropriate state, set timeout with networkconnect as callback function and appropriate
 *                   reconnect interval (see config file)
 *              4. Handle errors
 */
network.connect = function(url)
{
    try
    {        
        //your code here
    }
    catch(e)
    {
        console.error(e.stack);
        network.onConnectionChanged('Disconnected', network.connection)
    }
};
