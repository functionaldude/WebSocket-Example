(function(exports)
{
    exports.clientIdMsg = function(cid)
    {
        var msg = {};
        msg.type = 'ClientId';
        msg.yourId = cid;
        return msg
    };

    exports.reloadMsg = function()
    {
        return { type:'Reload' }
    };

    exports.networkInfoMsg = function(nodes)
    {
        var msg = {};
        msg.type = 'NetworkInfo';
        msg.nodes = nodes;
        return msg
    };

//-------------------------------------------------------------------------------------------

    exports.channelMsg = function(type, msg)
    {
        var net = {};
        net.type = type;
        net.payload = msg;
        return net
    }
})
(typeof exports === 'undefined' ? this['messages']={} : exports);
