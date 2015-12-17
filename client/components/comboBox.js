function comboBox()
{
    var combo = document.createElement("div")
    var comboContent = document.createElement("div")
    var comboDropDown = document.createElement("ul")
    var comboIndicator = document.createElement("div")
    var comboSelectedItem = document.createElement("div")
    var value = undefined

    combo.itemViewFactory = undefined
    combo.disabled = false
    combo.setAttribute('tabindex', 0)
    combo.onfocus = function () {}
    combo.onValueChanged = function(){}
    combo.onblur = function()
    {
        comboDropDown.style.display = 'none'
        comboContent.style.background = '-webkit-linear-gradient(bottom, #DEDEDE, #F6F6F6)'
    }
    combo.setValue = function(selectedModel, supress)
    {
        var newSelectedItem = combo.itemViewFactory(selectedModel, entityView)
        comboContent.replaceChild(newSelectedItem, comboContent.childNodes[0])

        combo.value = selectedModel
        if (!supress)
            combo.onValueChanged()
    }
    combo.insertItem = function(dbItem)
    {
        var liDiv = combo.itemViewFactory(dbItem, entityView)
        liDiv.id = dbItem.mid
        liDiv.onclick = function()
        {
            combo.setValue(dbItem)
        }
        var li = document.createElement('li')
        li.appendChild(liDiv)
        comboDropDown.appendChild(li)
    }

    comboContent.id = 'content'
    comboContent.onclick = function()
    {
        comboDropDown.style.display =
            comboDropDown.style.display === 'none' && !combo.disabled ?
                'block' : 'none'


        comboContent.style.background =
            comboDropDown.style.display === 'none' ?
                '-webkit-linear-gradient(bottom, #DEDEDE, #F6F6F6)' :
                '-webkit-linear-gradient(top, #DEDEDE, #F6F6F6)'
    }

    comboIndicator.id = 'indicator'
    comboIndicator.innerText = '\u25bc'

    comboDropDown.className = 'cdd'
    comboDropDown.style.display = 'none'

    comboContent.appendChild(comboSelectedItem)
    comboContent.appendChild(comboIndicator)
    combo.appendChild(comboContent)
    combo.appendChild(comboDropDown)

    return combo
}
