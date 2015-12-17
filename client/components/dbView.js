function dbView()
{
    var dbView = {}
    dbView.estimatedRange = undefined
    dbView.clear = function()
    {
        $('#entities').empty()
    }
    dbView.setModelColor = function(mid, t, c)
    {
        if (!c)
        {
            var midOutOfRange = !dbView.estimatedRange
                              || mid < dbView.estimatedRange.begin
                              || mid > dbView.estimatedRange.end
            c = midOutOfRange ? config.colors.entity : config.colors.entityInRange
        }
        $('#entities #' + mid).animate({ backgroundColor:c }, { duration:t, queue:false })
    }
    dbView.setModelHeader = function(mid, t)
    {
        var c = config.colors.entityLoading
        if (app.db.getItem(mid) && app.db.getItem(mid).features)
            c = '#80CCE6'

        $('#entities #' + mid + ' .header').animate({ backgroundColor:c }, { duration:t, queue:false })
    }
    dbView.setRange = function(range)
    {
        dbView.estimatedRange = range
        for (var i = 0; i < app.db.size(); i++)
            this.setModelColor(i, 0)
    }

    dbView.insertDbItem = function(dbItem)
    {
        var viewElement = entityViewPanel(dbItem, entityView)
        viewElement.id = dbItem.mid
        viewElement.onclick = function()
        {
            var activeTab = $('.search:visible')[0]
            view.insertTab(dbItem).startQuery()
        }
        $("#database #entities").append(viewElement)
    }

    dbView.addWorkerView = function(name)
    {
        var progress = document.createElement('progress')
        progress.id = name
        progress.className = 'workerProgress'
        progress.value = 0
        progress.min = 0
        progress.max = 100
        $('#workerJobs').append(progress)
        return progress
    }

    dbView.removeWorkerView = function(name)
    {
        $('#' + name).hide(500, function() { $('#' + name).remove() })
    }

    dbView.addWorkerJobView = function(j)
    {
        j.progressBar = dbView.addWorkerView('w' + j.id)
        j.onStateChange = function(j)
        {
            j.progressBar.value = j.state.progress * 100
        }
    }

    dbView.removeWorkerJobView = function(j)
    {
        dbView.removeWorkerView('w' + j.id)
    }
    return dbView
}
