var network = {}
network.onMessage = undefined
network.nextFreeConnectionId = 0 // zählt einfach hoch, nur zum debuggen
network.onConnectionChanged = undefined
network.connection = {}
network.connection.send = function() { throw new Error("Websocket never opened") }
network.connection.close = function() { /* nothing to do */ }
network.connect = function(url)
{
    try
    {
        var ws = new WebSocket(url)
        network.onConnectionChanged('Connecting', network.connection)

        ws.onopen = function()
        {
            network.connection = {}
            network.connection.id = network.nextFreeConnectionId++
            network.connection.close = function() { ws.close() }
            network.connection.send = function(msg)
            {
                var data = JSON.stringify(msg)
                try
                {
                    ws.send(data)
                    sim.log('net', 'log', '⟶', msg)                    
                }
                catch(e)
                {
                    ws.close()
                    throw e
                }
            }
            network.onConnectionChanged('Connected', network.connection)
        }
        ws.onmessage = function(ev)
        {
            try
            {
                var parsed = JSON.parse(ev.data)
                sim.log('net', 'log', '⟵', parsed)
                network.onMessage(network.connection, parsed)
            }
            catch(e)
            {
                console.error(e.stack)
            }
        }
        ws.onclose = function(ev)
        {
            network.onConnectionChanged('Disconnected', network.connection)
            setTimeout(function() { network.connect(url)}, config.client.reconnectIntervall)
        }
    }
    catch(e)
    {
        console.error(e.stack)
        network.onConnectionChanged('Disconnected', network.connection)
    }
}
