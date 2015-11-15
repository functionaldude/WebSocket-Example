var app = {};
app.clientId = undefined;
app.wsUrl = 'ws://' + document.location.hostname + ':' + config.server.wsport;
app.setClientId = function(yourId)
{
    app.clientId = yourId;
    view.setConnectionInfo('Connected as client ' + 'C' + Number(app.clientId).toSubscript())
};


// called by GUI --------------------------------------------------------------------------

app.init = function()
{
    app.db.load();
    view.loadAuthors();
    view.insertTab();
    view.networkInfo.onChanged = app.networkInfo.activeChange;
    network.onConnectionChanged = app.onNetworkStateChange;
    network.connect(app.wsUrl)
};
app.reloadAll = function()
{
    var msg = messages.reloadMsg();
    var channelMsg = messages.channelMsg('Ws', msg);
    network.connection.send(channelMsg)
};

// called by Net --------------------------------------------------------------------------

app.onNetworkStateChange = function(state, connection)
{
    var functionOfState =
    {
        onConnecting: function()
        {
            view.setConnectionInfo('Auto reconnect \u21c4')
        },

        onConnected: function()
        {
            view.setConnectionInfo('Connected')
        },

        onDisconnected: function()
        {
            view.setConnectionInfo('Auto reconnect');
            view.db.setRange();
            view.networkInfo.update('clear')
        }

    }['on'+state]()
};

/**
 * @param c connection
 * @param parsed received parsed message
 *
 * Student TODO (Task: Dispatching messages in client): depending on the type of the parsed message,
 *              call the appropriate function:
 *              location.reload, app.setClientId, app.networkInfo.passiveChange
 */
app.onMessage = function(c, parsed)
{
    console.log(parsed);
    var channelHandlers =
    {
        onWsMessage: function(c, parsed)
        {
            sim.log('app', 'log', '⟵', parsed);
        },
        onReloadMessage: function(c, parsed){
            console.log('reload msg');
            location.reload();
        },
        onClientIdMessage: function(c, parsed){
            console.log('clientid msg');
            c.id = parsed.yourId;
            app.setClientId(parsed.yourId);
        },
        onNetworkInfo: function(c, parsed){
            console.log('network msg');
        }
    }['on'+parsed.type+'Message'](c, parsed.msg)
};

//-----------------------------------------------------------------------------------------

app.db = function()
{
    var db = { data:undefined, pageNr:0, fetch:0 };
    db.begin = function() { return db.pageNr * config.dbsize };

    db.size    = function()    { return db.data.length };
    db.getItem = function(mid) { return db.data[mid]   };

    db.nextPage = function() { db.pageNr += 1; db.load() };
    db.prevPage = function() { db.pageNr -= 1; db.load() };

    db.load = function()
    {
        db.data = [];
        view.db.clear();
        var dbprogress = view.db.addWorkerView('db' + db.fetch++);

        for (var i = 0; i < config.dbsize; i++)
        {
            var realId = db.pageNr * config.dbsize + ~~((i%10)*10+(i/10)%10);

            var item = loadDbEntity(i, realId);
            item.setFeatures = function(f)
            {
                this.features = f;

                if (!this.features)
                    view.db.setModelHeader(this.mid, 0, 'red');
                else
                    view.db.setModelHeader(this.mid, 0);

                if (++dbprogress.value >= config.dbsize)
                    view.db.removeWorkerView(dbprogress.id)
            };

            db.data.push(item);
            view.db.insertDbItem(item)
        }
    };

    return db
}();

//-----------------------------------------------------------------------------------------


app.networkInfo = function()
{
    var netInfo = {};

    /**
     * @param nodes list of nodes
     *
     * Student TODO (Task: app.NetworkInfo in client): Update the local simulation configuration,
     *              create the correct type of message and send the nodes list to the server (to the network).
     */
    netInfo.activeChange = function(nodes)
    {
        sim.log('app', 'log', '⟶', nodes);

        // your code here
    };

    /**
     * @param c client/connection object
     * @param parsed parsed object containing new node configuration
     *
     * Student TODO (Task: app.NetworkInfo in client): Update the local simulation configuration and update the database
     *              range maintained by this client. (Check if message is relevant first!)
     * Student TODO (Task: app.NetworkInfo in client): Update the view accordingly.
     */
    netInfo.passiveChange = function(c, parsed)
    {
        // your code here
    };
    return netInfo
}();

//-----------------------------------------------------------------------------------------




