function networkView()
{
    var netView = {}
    netView.updatingNetworkInfo = false
    netView.update = function(msg)
    {
        netView.updatingNetworkInfo = true

        if (msg === 'clear')
            $('#info #nodes').empty()

        if (msg.nodes)
        {
            msg.nodes.forEach(function(idx, id, val)
            {
                if (val === 'deadbeef')
                    $('#n'+id).remove()

                else if (val)
                    tools.findOrCreateHtmlElement('n'+id, '#info #nodes', nodeConfigView)
                        .setData(id, val)
                        .setDataChange(function onChange(nid, nstate){
                            var nodes = {}
                            nodes[nid] = nstate
                            if (!netView.updatingNetworkInfo)
                                netView.onChanged(nodes)
                        })
            })
        }

        netView.updatingNetworkInfo = false
    }
    return netView
}
