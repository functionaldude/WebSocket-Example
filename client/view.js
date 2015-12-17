var view = {}
view.nextFreeTabId = 0
view.db = dbView()
view.networkInfo = networkView()
// view.search = tabView(¹)
view.setConnectionInfo = function(msg)
{
    $('#header #connection').text(msg)
}
view.loadAuthors = function()
{
    var students = ''
    config.authors.forEach(function(author)
    {
        students += author.matNr + ' ' + author.firstName + ' ' + author.lastName + ' \u2022 '
    })
    $('#footer-students').text(students.substring(0, students.length - 3))
    $('#footer-server').text(app.wsUrl)
}
view.insertTab = function(dbItem)
{
    var tabId = view.nextFreeTabId++
    var tabHeader = document.createElement('div')
    var tab = searchView(dbItem, tabId)

    tab.onJobChanged = function(j)
    {
        tabHeader.innerText = 'J' + j.toSubscript()
    }

    tabHeader.id = 'tab-header-' + tabId
    tabHeader.className = 'tab'
    tabHeader.innerText = 'new'
    tabHeader.setActive = function(active)
    {
        $('#requester .tab-active').removeClass('tab-active').addClass('tab')
        tabHeader.className = 'tab-active'
        $('#tab-content').find('> div').hide()
        tab.style.display = 'block'
    }
    tabHeader.remove = function()
    {
        $('#' + tabHeader.id).remove()
        $('#' + tab.id).remove()
    }
    tabHeader.onclick = function()
    {
        tabHeader.setActive(tabId)
    }

    $("#tab-header-add").before(tabHeader)
    $("#tab-content").append(tab)

    tabHeader.setActive(tabId)

    var timeoutId = 0
    $('#' + tabHeader.id).mousedown(function()
    {
        timeoutId = setTimeout(tabHeader.remove, 700)
    }).bind('mouseup mouseleave', function()
    {
        clearTimeout(timeoutId);
    })

    if ($("#tab-content > div").length > 6)
    {
        $("#tab-header > div")[0].remove()
        $("#tab-content > div")[0].remove()
    }
    return tab
}



