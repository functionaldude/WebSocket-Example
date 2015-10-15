(function(exports, shellMode)
{
    exports.config = undefined // will be set on init, and if somebody changes it on the network panel

    exports.isEnabled = function(test)
    {
        return this.config[test] && this.config[test].active
    }

    exports.pointOfFailure = function(pointName, c, p)
    {
        if (this.config.disconnect && this.config.disconnect.active)
            if (pointName === this.config.disconnect.pof)
                c.close()

        if (this.config.exception && this.config.exception.active)
            if (pointName === this.config.exception.pof)
                throw new Error(this.config.exception.value)

        if (this.config.delegate && this.config.delegate.active)
            if (pointName === 'beforeWork')
                p.payload.type = 'Delegate'
    }

    exports.delayedSection = function(j, action)
    {
        if (this.isEnabled('delayed'))
        {
            setTimeout(function()
            {
                j.exception2localError(function()
                {
                    if (action()) exports.delayedSection(j, action)
                })
            },
            exports.config.delayed.value)
        }
        else
        {
            while(action()) {}
        }
    }

    exports.log = function()
    {
        var argArray = Array.prototype.slice.call(arguments)
        var category = argArray[0]
        var level = argArray[1]
        var desc = category

        if (shellMode)
            desc = '\n------------------------------------------------------------\n' + category

        if (!this.config || this.config['log' + category].active)
        {
            var remainingsArgs = JSON.parse(JSON.stringify(argArray.slice(2)))
            var logArgs = [desc].concat(remainingsArgs)
            console[level].apply(console, logArgs)
        }
    }     
})
(typeof exports === 'undefined' ? this['sim']={} : exports, typeof exports !== 'undefined')
