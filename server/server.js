var config   = require('../config.js')
var sim      = require('../sim.js')
var messages = require('../messages.js')
var tools    = require('../tools.js')

var app = {}
app.clientId = 0
sim.config = config.server.defaultSimConfig

// called by Net --------------------------------------------------------------------------

/**
 * app.onNetworkStateChange
 *
 * @param state the client state, Connected or Disconnected
 * @param connection the client connection
 *
 * Student TODO (Task: Server Network continuation): handle the cases of a network state change onConnected and
 *               onDisconnected by adding and removing nodes
 */
app.onNetworkStateChange = function(state, connection)
{
    // your code here
};

app.onMessage = function(c, parsed)
{
    var channelHandlers =
    {
        /**
         * app.onWsMessage behaviour of the server in case the node configuration suffers some modification
         *
         * @param c connection
         * @param parsed message, can have Reload or NetworkInfo types
         *
         * Student TODO (Task: Dispatching messages in server): handle the 2 cases: change the network info
         *              or notify accordingly
         */
        onWsMessage: function(c, parsed)
        {
            sim.log('app', 'log', '⟵', parsed)

            // your code here
        }
    }['on'+parsed.type+'Message'](c, parsed.payload)
}

//-------------------------------------------------------------------------------------------

app.networkInfo = function()
{
    var netInfo = {}
    netInfo.nodes = {}
    netInfo.nodesCount = function() { return Object.keys(netInfo.nodes).length }
    netInfo.nodes[0] = {
        clientcount: 0,
        dbLen: config.dbsize,
        simconfig: sim.config
    }

    function updateCache(changedNodes)
    {
        function createNode()
        {
            var newNode = {}
            newNode.range = 'invalid'
            newNode.simconfig = config.client.defaultSimConfig
            return newNode
        }

        function updateRanges()
        {
            console.assert(network.connectionCount() === (netInfo.nodesCount() - 1))

            netInfo.nodes[0].clientcount = network.connectionCount()
            netInfo.nodes.forEach(function (idx, cid, node)
            {
                node.range = node.range ?
                             tools.rangeOfPart({ begin:0, end:config.dbsize }, netInfo.nodesCount() - 1, idx - 1) :
                             undefined
            })
        }

        changedNodes.forEach(function(idx, id, v)
        {
            if      (v === 'freshbeef') netInfo.nodes[id] = createNode()
            else if (v === 'deadbeef')  delete netInfo.nodes[id]
            else                        netInfo.nodes[id] = v
        });

        if (changedNodes[app.clientId])
            sim.config = changedNodes[app.clientId].simconfig

        updateRanges();
        console.log(netInfo.nodes)
    }

    /**
     * @param changedConnection The client connection to add to the nodes list.
     *
     * Student TODO (Task: app.NetworkInfo in server): Create a network info message with the newly updated
     *              list of all nodes and send it as a channel message to all clients.
     */
    netInfo.addNode = function(changedConnection)
    {
        sim.log('app', 'log', '+ node ' + changedConnection.id);

        var nodes = {};
        nodes[changedConnection.id] = 'freshbeef';
        updateCache(nodes);

        // your code here
    };

    /**
     * @param changedConnection The client connection to remove from the nodes list.
     *
     * Student TODO (Task: app.NetworkInfo in server): Create a network info message with the newly updated
     *              list of all nodes and send it as a channel message to all clients.
     */
    netInfo.removeNode = function(changedConnection)
    {
        sim.log('app', 'log', '- node ' + changedConnection.id);

        var nodes = {};
        nodes[changedConnection.id] = 'deadbeef';
        updateCache(nodes);

        // your code here
    };

    /**
     * @param c The client who triggered the passiveChange.
     * @param parsed Content received (after parsing) - list of node configurations.
     *
     * Student TODO (Task: app.NetworkInfo in server): Send a multi-cast message containing the parsed list
     *              to all connected clients (except the sender).
     */
    netInfo.passiveChange = function(c, parsed)
    {
        sim.log('app', 'log', '⟵', 'node content changed by node ' + c.id);

        updateCache(parsed.nodes);

        // your code here
    };
    return netInfo
}();

//-------------------------------------------------------------------------------------------

var network = require('./network').network
network.onConnectionChanged = app.onNetworkStateChange
network.onMessage = app.onMessage
network.sim = sim

//-------------------------------------------------------------------------------------------

var connect = require('connect')
var serveStatic = require('serve-static')
connect().use(serveStatic('../')).listen(config.server.httpport)






