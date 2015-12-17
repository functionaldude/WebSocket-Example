function entityViewPanel(model, contentFactory)
{
    var viewElement = document.createElement('div')
        var blueHeader = document.createElement('div')
        var thumbnail = contentFactory(model)

    viewElement.header = blueHeader
    blueHeader.className = 'header'
    thumbnail.className = 'thumbnail'
    viewElement.model = model
    viewElement.className = 'model'
    viewElement.draggable = true
    viewElement.ondragstart = function drag(ev)
    {
        ev.dataTransfer.setData("text", ev.target.id)
    }
    viewElement.appendChild(thumbnail)
    viewElement.appendChild(blueHeader)
    return viewElement
}
