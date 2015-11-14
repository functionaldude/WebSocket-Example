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
        network.onConnectionChanged("Connecting", network.connection);

        var connection = new WebSocket(url);

        connection.onopen = function() {
            network.onConnectionChanged("Connected", network.connection);
        };

        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        // Log messages from the server
        connection.onmessage = function (e) {
            console.log(e.data);
            app.onMessage(network.connection, JSON.parse(e.data));
        };

        connection.onclose = function (e) {
            console.log('Server closed connection');
            setTimeout(function(){
                network.connect(url);
            }, config.client.reconnectIntervall);
        };
        network.connection.send = function(msg){
            connection.send(JSON.stringify(msg));
        }
    }
    catch(e)
    {
        console.error(e.stack);
        network.onConnectionChanged('Disconnected', network.connection)
    }
};
