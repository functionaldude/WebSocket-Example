function searchView(dbItem, tabId)
{
    var tab = document.createElement('div')
        var query = document.createElement('div')
            var start = document.createElement("button")
            var stop = document.createElement("button")
            var restart = document.createElement("button")
            var queryParameter = parameterView(dbItem)
            var jpCancel = document.createElement("div")
            var jpErrorRecover = document.createElement("div")
            var jpResponseTimeout = document.createElement("div")
    var status = document.createElement("div")
    var result = document.createElement("div")

    tab.id = 'tab-' + tabId
    tab.className = 'search'
    tab.onJobChanged = undefined
    tab.startQuery = function(dbItem)
    {
        if (dbItem)
            queryParameter.setValue(dbItem)

        var jconfig =
        {
            terminateTimeout: config.client.terminateTimeout,
            responseTimeout: jpResponseTimeout.check ? config.client.responseTimeout : undefined,
            cancelOnFatal: jpCancel.check,
            tryRecover: jpErrorRecover.check
        }
        tab.j = app.search(tab, queryParameter.value(), jconfig)
        tab.updateControlState()
        tab.onJobChanged(tab.j)
        tab.j.execute()
    }
    tab.cancelQuery = function()
    {
        stop.disabled = true
        tab.j.cancel()
    }
    tab.updateControlState = function(stat)
    {
        tab.busy = !tab.j.isTerminatated()

        if (tab.busy)
        {
            start.style.display = 'none'
            stop.style.display = 'block'
            restart.style.display = 'none'
            queryParameter.setDisabled(true)

            result.innerText = ''
            status.innerText = ''
            status.style.display = 'block'
        }
        else
        {
            start.style.display = 'none'
            stop.style.display = 'none'
            stop.disabled = false
            restart.style.display = 'block'
            queryParameter.setDisabled(false)
        }
    }
    tab.insertResultItems = function(dbItems)
    {
        for(var i = 0; i < dbItems.length; i++)
        {
            var matchItem = dbItems[i]
            var viewElement = entityViewPanel(matchItem, matchItemView)
            viewElement.id = matchItem.dbEntity.mid
            viewElement.onclick = function()
            {
                view.insertTab(matchItem.dbEntity).startQuery()
            }
            var firstWithGreaterDiff = undefined
            for (var j = 0; j < result.childNodes.length; j++)
            {
                var current = result.childNodes[j]
                if (current.model.diff > matchItem.diff)
                {
                    firstWithGreaterDiff = current
                    break
                }
            }
            result.insertBefore(viewElement, firstWithGreaterDiff)
        }
    }
    tab.updateJobState = function(j)
    {
        tab.onJobChanged(tab.j)

        var jview = document.getElementById('j' + j.id)
        if (!jview)
        {
            jview = jobStatusView(j.id)
            var jobviewParentDiv = status
            if (j.pid !== undefined)
                jobviewParentDiv = document.getElementById('j' + j.pid + '-subjobs')
            jobviewParentDiv.appendChild(jview)
        }
        jview.appendLog(j)

        if (j.origin)
           tab.updateJobState(j.origin)
    }


    query.className = 'query'
    start.id = 'start'
    start.innerText =  '\u25b6' //'\u23f5'
    start.style.fontSize = 9
    start.style.paddingTop = 0
    start.onclick = function() { tab.startQuery() }
    stop.id = 'stop'
    stop.innerText = '\u25a0' //'\u23f9'
    stop.style.display = 'none'
    stop.style.paddingTop = -2
    stop.onclick = function() { tab.cancelQuery() }
    restart.id = 'restart'
    restart.innerText = '\u21bb' //'\u27f3'
    restart.style.display = 'none'
    restart.style.paddingTop = 2
    restart.onclick = function() { tab.startQuery() }
    queryParameter.startQuery = tab.startQuery
    queryParameter.onvalid = function()
    {
        restart.style.display = 'none'
        start.disabled = false
        start.style.display = 'block'
        start.focus()
    }

    jpResponseTimeout.className = 'buttonRight'
    jpResponseTimeout.innerText = '\uD83D\uDD52' //'\u23F1'
    jpResponseTimeout.style.marginTop = 1
    jpResponseTimeout.check = false
    jpResponseTimeout.style.fontSize = 18
    jpResponseTimeout.title = 'activate response timeout'
    jpResponseTimeout.onclick = function()
    {
        jpResponseTimeout.check = !jpResponseTimeout.check
        jpResponseTimeout.style.color = jpResponseTimeout.check ?
                    config.colors.enabledIcon :
                    config.colors.disabledIcon
    }
    jpErrorRecover.className = 'buttonRight'
    jpErrorRecover.innerText = '\uD83C\uDF40'
    jpErrorRecover.check = false
    jpErrorRecover.style.fontSize = 15
    jpErrorRecover.title = 'enable error recovering'
    jpErrorRecover.onclick = function()
    {
        jpErrorRecover.check = !jpErrorRecover.check
        jpErrorRecover.style.color = jpErrorRecover.check ?
                    config.colors.enabledIcon :
                    config.colors.disabledIcon
    }
    jpCancel.className = 'buttonRight'
    jpCancel.innerText = '\u26d4'
    jpCancel.check = false
    jpCancel.style.fontSize = 15
    jpCancel.title = 'cancel others on error'
    jpCancel.onclick = function()
    {
        jpCancel.check = !jpCancel.check
        jpCancel.style.color = jpCancel.check ?
                    config.colors.enabledIcon :
                    config.colors.disabledIcon
    }
    status.id = 'status'
    result.id = 'result'
    result.style.margin = '10'
    result.style.clear = 'both'

    query.appendChild(start)
    query.appendChild(stop)
    query.appendChild(restart)
    query.appendChild(queryParameter)
    //query.appendChild(jpResponseTimeout)
    //query.appendChild(jpErrorRecover)
    //query.appendChild(jpCancel)
    tab.appendChild(query)
    tab.appendChild(status)
    tab.appendChild(result)
    return tab
}

