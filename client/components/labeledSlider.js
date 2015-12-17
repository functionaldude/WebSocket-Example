function labeledSlider(min, max, value, pre, post, p, w)
{
    var slider = document.createElement("div")
        var threshholdPrefix = document.createElement("div")
        var threshholdValue = document.createElement("div")
        var threshholdPostfix = document.createElement("div")
        var threshholdSlider = document.createElement("input")

    slider.value = value
    slider.onchange = function() {}
    slider.setValue = function(v)
    {
        slider.value = v
        threshholdSlider.value = v * 100
        threshholdSlider.oninput()
    }
    slider.setDisabled = function(d)
    {
        threshholdSlider.disabled = d
    }

    threshholdPrefix.id = 'lslider-prefix'
    threshholdPrefix.innerText = pre

    threshholdValue.id = 'lslider-value'
    threshholdValue.innerText = slider.value
    threshholdValue.style.width = w
    //threshholdValue.style.textAlign = 'right'

    threshholdPostfix.id = 'lslider-postfix'
    threshholdPostfix.innerText = post

    threshholdSlider.id = 'lslider-slider'
    threshholdSlider.setAttribute('type', 'range')
    threshholdSlider.setAttribute('min', min*100)
    threshholdSlider.setAttribute('max', max*100)
    //threshholdSlider.setAttribute('value', slider.value*100)
    threshholdSlider.value = slider.value*100
    threshholdSlider.oninput = function()
    {
        slider.value = threshholdSlider.value/100
        threshholdValue.innerText = slider.value.toFixed(p)
        slider.onchange(slider.value)
    }

    slider.appendChild(threshholdPrefix)
    slider.appendChild(threshholdValue)
    slider.appendChild(threshholdPostfix)
    slider.appendChild(threshholdSlider)
    return slider
}


