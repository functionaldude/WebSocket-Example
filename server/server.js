var config   = require('../config.js')
var sim      = require('../sim.js')
var messages = require('../messages.js')
var common   = require('../common.js')
var tools    = require('../tools.js')

var app = {}
app.clientId = 0
sim.config = config.server.defaultSimConfig
app.searches = {}
app.searchCounter = 0

// called by Net --------------------------------------------------------------------------

app.onNetworkStateChange = function(state, connection)
{
    var stateHandlers =
    {
        onConnected: function()
        {
            var msg = messages.clientIdMsg(connection.id)
            var channelMsg = messages.channelMsg('Ws', msg)
            connection.send(channelMsg)

            app.networkInfo.addNode(connection)            
        },

        onDisconnected: function()
        {
            app.networkInfo.removeNode(connection)
        }
    }
    stateHandlers['on'+state]()
}
app.onMessage = function(c, parsed)
{
    var channelHandlers =
    {
        onWsMessage: function(c, parsed)
        { sim.log('app', 'log', '⟵', parsed)

            var messageHandlers =
            {
                onReload: function(c, parsed)
                {
                    var channelMsg = messages.channelMsg('Ws', parsed)
                    network.sendBroadcast(channelMsg)
                },

                onNetworkInfo: function(c, parsed)
                {
                    app.networkInfo.passiveChange(c, parsed)
                }

            }['on'+parsed.type](c, parsed)
        },

        onJobMessage: function(c, parsed)
        {sim.log('app', 'log', '⟵', parsed)

            var messageHandlers = {

                onSearch: function(c, parsed){
                    var id = app.searchCounter++
                    app.searches[id] = {
                        state:'pending',
                        clientId:c.id,
                        clientCtn: network.connectionCount(),
                        qId:parsed.qId
                    }
                    var msg = messages.searchRequestMsg(parsed.param, id)
                    network.sendBroadcast(messages.channelMsg('Job', msg))
                },
                onMatches: function(c, parsed){
                    var search = app.searches[parsed.searchId]
                    search.clientCtn--
                    parsed.qId = search.qId
                    network.connections[search.clientId].send(messages.channelMsg('Job', parsed))
                    //TODO: state ok
                    if (search.clientCtn == 0){
                        var msg = messages.searchStateMsg('ok', search.qId)
                        network.connections[search.clientId].send(messages.channelMsg('Job', msg))
                    }
                }

            }['on'+parsed.type](c, parsed)
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
        })

        if (changedNodes[app.clientId])
            sim.config = changedNodes[app.clientId].simconfig

        updateRanges()
        //console.log(netInfo.nodes)
    }

    netInfo.addNode = function(changedConnection)
    { sim.log('app', 'log', '+ node ' + changedConnection.id)

        var nodes = {}
        nodes[changedConnection.id] = 'freshbeef'
        updateCache(nodes)

        var msg = messages.networkInfoMsg(netInfo.nodes)
        var channelMsg = messages.channelMsg('Ws', msg)
        network.sendBroadcast(channelMsg)
    }

    netInfo.removeNode = function(changedConnection)
    { sim.log('app', 'log', '- node ' + changedConnection.id)

        var nodes = {}
        nodes[changedConnection.id] = 'deadbeef'
        updateCache(nodes)

        var msg = messages.networkInfoMsg(nodes)
        var channelMsg = messages.channelMsg('Ws', msg)
        network.sendBroadcast(channelMsg)
    }

    netInfo.passiveChange = function(c, parsed)
    { sim.log('app', 'log', '⟵', 'node content changed by node ' + c.id)

        updateCache(parsed.nodes)

        var receivers = Object.keys(network.connections).without([c.id.toString()])
        var channelMsg = messages.channelMsg('Ws', parsed)
        network.sendMulticast(receivers, channelMsg)
    }
    return netInfo
}()

//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------

var network = require('./network').network
network.onConnectionChanged = app.onNetworkStateChange
network.onMessage = app.onMessage
network.sim = sim

//-------------------------------------------------------------------------------------------

var connect = require('connect')
var serveStatic = require('serve-static')
connect().use(serveStatic('../')).listen(config.server.httpport)






