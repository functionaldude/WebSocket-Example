error = {}
error.delaySlider = function()
{
    var slider = labeledSlider(10, 300, 10, '', 'ms', 0, 20)
    slider.updating = false
    slider.datachange = function() {}
    slider.setdata = function(pof, value)
    {
        slider.setValue(value)
    }
    slider.onchange = function()
    {
        slider.datachange(undefined, slider.value)
    }

    slider.id = 'delay'
    return slider
}
error.pOfSelect = function()
{
    // \uD83D\uDDA5
    // \u21B7
    var select = document.createElement('select')
    select.datachange = function() {}
    select.setdata = function(pof, value)
    {
        select.value = pof
    }
    select.onchange = function()
    {
        select.datachange(select.value, undefined)
    }

    select.options.add(new Option("☏ before request", "beforeRequest"))
    select.options.add(new Option("☎ after request",  "afterRequest"))
    select.options.add(new Option("⚒ before work",    "beforeWork"))
    select.options.add(new Option("⚒ at work",        "atWork"))
    select.options.add(new Option(" on response",    "onResponse"))
    select.options.add(new Option("⇥ on terminate",   "onTerminate"))
    select.style.height = 21
    select.style.float = 'right'
    select.style.marginLeft = 10
    select.style.marginTop = 0
    return select
}
error.exceptionsSelect = function()
{
    var div = document.createElement('div')
        var pofSelect = this.pOfSelect()    
        var fatal = document.createElement('div')
        var recoverable = document.createElement('div')

    div.datachange = function() {}
    div.setdata = function(pof, value)
    {
        pofSelect.setdata(pof)
        div.setExceptionType(value)
    }
    div.setExceptionType = function(value)
    {
        recoverable.style.color = value === 'fatal' ?
                    config.colors.disabledIcon :
                    config.colors.enabledIcon
        fatal.style.color       = value === 'fatal' ?
                    config.colors.enabledIcon :
                    config.colors.disabledIcon
    }

    pofSelect.datachange = function(pof)
    {
        div.datachange(pof, undefined)
    }

    fatal.className = 'checkLeft'
    fatal.innerText = '⚡'
    fatal.title = 'fatal exception'
    fatal.style.marginRight = 3
    fatal.style.width = 20
    fatal.onclick = function()
    {
        div.setExceptionType('fatal')
        div.datachange(undefined, 'fatal')
    }

    recoverable.className = 'checkLeft'
    recoverable.innerText = '⛈'
    recoverable.title = 'recoverable exception'
    recoverable.style.marginTop = -2
    recoverable.style.color = 'lightgray'
    recoverable.style.width = 20
    recoverable.onclick = function()
    {
        div.setExceptionType('recoverable')
        div.datachange(undefined, 'recoverable')
    }

    div.appendChild(pofSelect)
    div.appendChild(recoverable)    
    div.appendChild(fatal)
    return div
}

function nodeConfigErrorSim()
{

}

function nodeConfigView()
{
    var main = document.createElement('div')
        var header = document.createElement('div')
            var nodeName = document.createElement('div')
            var headerText = document.createElement('div')
        var list = document.createElement('ul')
        var headerBar = document.createElement('div')

    var viewFactory =
    {
        delayed:    function() { return error.delaySlider()      },        
        stopWork:   function() { return error.pOfSelect()        },
        disconnect: function() { return error.pOfSelect()        },
        exception:  function() { return error.exceptionsSelect() }
    }

    main.className = 'object'
    main.updating = false
    main.datachange = function() {}
    main.setDataChange = function(h)
    {
        main.datachange = h
    }
    main.setData = function(cid, nodeConfig)
    {
        main.updating = true
        if (cid == app.clientId)
            main.style.backgroundColor = '#FFFFD0'

        nodeName.innerText = (cid === '0' ? 'S' : 'C') + Number(cid).toSubscript()
        headerText.innerText = nodeConfig.range ?
                               'estimated range ' + nodeConfig.range.begin + '-' + nodeConfig.range.end :
                               nodeConfig.clientcount + ' clients connected, ' + nodeConfig.dbLen + ' db entities'

        nodeConfig.simconfig.forEach(function(idx, id, e)
        {
            var errorViewId = 'n' + cid + '-' + id
            var errorView = document.getElementById(errorViewId)            
            if (!errorView)
            {
                errorView = document.createElement('li')
                errorView.id = errorViewId
                errorView.style.display = 'none'

                    var errorIconActive = document.createElement('div')
                    var errorText = document.createElement('div')
                    var line = document.createElement('div')
                    var errorVal = viewFactory[id] ? viewFactory[id]() : null
                var errorIcon = document.createElement('div')

                errorIcon.className = 'buttonRight'
                errorIcon.style.color = '#aaa'                
                errorIcon.onclick = function()
                {
                    if (errorVal)
                        setActive(true)
                    else
                        toggleActive()
                }

                header.appendChild(errorIcon)

                function setActive(a)
                {
                    e.active = a
                    if (errorVal)
                    {
                        errorIcon.style.display = e.active ? 'none' : 'block'
                        errorView.style.display = e.active ? 'block' : 'none'
                    }
                    else
                    {
                        errorIcon.style.color = e.active? config.colors.enabledIcon :
                                                          config.colors.disabledIcon
                    }
                    main.datachange(cid, nodeConfig)
                }

                function toggleActive()
                {
                    e.active = !e.active
                    errorIcon.style.color = e.active? config.colors.enabledIcon :
                                                      config.colors.disabledIcon
                    main.datachange(cid, nodeConfig)
                }

                errorIconActive.className = 'checkLeft'
                errorIconActive.onclick = function() { setActive(false) }

                errorText.className = 'nodeHeaderText'
                errorText.style.marginRight = 3
                errorText.onclick = function() { setActive(false) }

                if (errorVal)
                {
                    errorVal.style.float = 'right'
                    errorVal.datachange = function(pof, value)
                    {
                        if (!main.updating)
                        {
                            if (value) e.value = value
                            if (pof) e.pof = pof                           
                            main.datachange(cid, nodeConfig)
                        }
                    }
                }

                errorView.setData = function(newErrorData)
                {
                    setActive(newErrorData.active)
                    errorIcon.innerText = newErrorData.icon
                    errorIcon.title = newErrorData.text
                    errorIconActive.innerText = newErrorData.icon
                    errorIconActive.title = newErrorData.text
                    errorText.innerText = newErrorData.text


                    if (errorVal)
                        errorVal.setdata(newErrorData.pof, newErrorData.value)
                }

                line.style.height = 15
                line.style.marginLeft = 5
                line.style.overflow = 'hidden'
                line.style.borderBottom = '1px dotted #C3C3C3'

                errorView.appendChild(errorIconActive)
                if (errorVal) errorView.appendChild(errorVal)                
                errorView.appendChild(errorText)
                errorView.appendChild(line)
                list.appendChild(errorView)
            }
            errorView.setData(e)
        })
        main.updating = false
        return main
    }

    header.className = 'header'
    headerText.className = 'nodeHeaderText'
    nodeName.className = 'nodeHeaderText'
    //nodeName.style.fontSize = 18

    list.className = 'errorSimList'
    headerBar.className = 'headerBar'

    header.appendChild(nodeName)
    header.appendChild(headerText)
    main.appendChild(header)
    main.appendChild(list)
    main.appendChild(headerBar)
    return main
}



