(function(exports)
{
    exports.clientIdMsg = function(cid)
    {
        var msg = {}
        msg.type = 'ClientId'
        msg.yourId = cid
        return msg
    }

    exports.reloadMsg = function()
    {
        return { type:'Reload' }
    }

    exports.networkInfoMsg = function(nodes)
    {
        var msg = {}
        msg.type = 'NetworkInfo'
        msg.nodes = nodes
        return msg
    }

//-------------------------------------------------------------------------------------------

    // Search job related messages.
    // These messages are intended to be sent over the 'Job' channel,
    // i.e. they should be wrapped in a channelMsg with a type of 'Job'.
    
    exports.searchMsg = function(param, clientId, qId)
    {
        var msg = {}
        msg.type = 'Search'
        msg.param = param
        msg.clientId = clientId
        msg.qId = qId

        return msg
    }

    exports.searchRequestMsg = function(param, searchId)
    {
        var msg = {}
        msg.type = 'Request'
        msg.param = param
        msg.searchId = searchId

        return msg
    }

    exports.searchResponseMsg = function(result, searchId)
    {
        var msg = {}
        msg.type = 'Matches'
        msg.result = result;
        msg.searchId = searchId

        return msg
    }

    exports.searchStateMsg = function(state, id, progress)
    {
        var msg = {}
        msg.type = 'State'
        msg.state = state;
        msg.id = id
        msg.progress = progress

        return msg
    }
    
    // STUDENT TODO: add more message types as necessary

//-------------------------------------------------------------------------------------------

    exports.channelMsg = function(type, msg)
    {
        var net = {}
        net.type = type
        net.payload = msg
        return net
    }
})
(typeof exports === 'undefined' ? this['messages']={} : exports)
