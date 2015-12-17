(function(exports)
{    
    exports.rangeOfPart = function(rangeToSplit, partsCount, idx)
    {        
        // here is a bug somewhere!
        var begin = rangeToSplit.begin
        var end = rangeToSplit.end
        var rangeLen = end-begin
        var partLen = rangeLen / partsCount

        return {
            begin: Math.floor(begin + idx * partLen),
            end: Math.floor(begin + (idx+1) * partLen) - 1
        }
    }

    Object.defineProperty(Object.prototype, 'forEach',
    {
        value: function(visit)
        {
          var idx = 0
          for (var key in this)
              visit(idx++, key, this[key])
        },
        writable: true,
        configurable: true,
        enumerable: false
    })

    Object.defineProperty(Array.prototype, 'without',
    {
        value: function(toRemove)
        {
            if (!toRemove)
                return this
            return this.filter(function(i) { return toRemove.indexOf(i) === -1 })
        },
        writable: true,
        configurable: true,
        enumerable: false
    })

    Object.defineProperty(Object.prototype, 'merge',
    {
        value: function(other)
        {
            var dest = this
            other.forEach(function(idx, id, v)
            {
                dest[id] = v
            })
            return this
        },
        writable: true,
        configurable: true,
        enumerable: false
    })

    Object.defineProperty(Number.prototype, 'toSubscript',
    {
        value: function()
        {
          var result = ''
          var str = this.toString()
          for (var i = 0; i < str.length; i++)
              result += String.fromCharCode(8320 + Number(str.charAt(i)))
          return result
        },
        writable: true,
        configurable: true,
        enumerable: false
    })

    exports.findOrCreateHtmlElement = function(id, parent, factory)
    {
        var elem = document.getElementById(id)
        if (!elem)
        {
            elem = factory()
            elem.id = id
            $(parent).append(elem)
        }
        return elem
    }
})
(typeof exports === 'undefined' ? this['tools']={} : exports)
