(function(exports)
{
    exports.dbsize = 100
    exports.authors = []
    exports.authors[0] = {}
    //Student TODO: Enter team members' names and matricular numbers.
    exports.authors[0].matNr     = '0123456'
    exports.authors[0].firstName = 'First name'
    exports.authors[0].lastName  = 'Last name'
    exports.authors[1] = {}
    exports.authors[1].matNr     = ''
    exports.authors[1].firstName = 'config.js must contain'
    exports.authors[1].lastName  = ''
    exports.authors[2] = {}
    exports.authors[2].matNr     = ''
    exports.authors[2].firstName = ''
    exports.authors[2].lastName  = 'matNr, firstname and lastname'
    exports.server = {}
    exports.server.wsport          = 1336
    exports.server.httpport        = 1337
    exports.server.requestProgress = 0.05
    exports.client = {}
    exports.client.reconnectIntervall = 300
    exports.client.terminateTimeout   = 7000
    exports.client.ttfbTimeout        = 500
    exports.client.responseTimeout    = 200
    exports.client.cancelTimeout      = 500
    exports.client.requestProgress    = 0.02
    exports.client.highlightTime      = 1000    
    exports.colors = {}
    exports.colors.idle            = 'orange'
    exports.colors.requests        = '#FFD900' //'orange'
    exports.colors.delegates       = '#A5F7B8'
    exports.colors.canceling       = '#EAB0F1' //'#E1A0E8' //'orange'
    exports.colors.recovering      = '#FFD900'
    exports.colors.found           = '#80CCE6'
    exports.colors.compared        = '#A5F7B8'
    exports.colors.ok              = '#00CC66'
    exports.colors.canceled        = '#D167DE' //'#A9DA13'  //'#00CC66'
    exports.colors.fatal           = 'red'
    exports.colors.recoverable     = 'red'
    exports.colors.failed          = 'red'
    exports.colors.timeout         = 'red'
    exports.colors.entityInRange   = '#FFFFb0'
    exports.colors.entity          = '#fefefe'
    exports.colors.entityLoading   = 'red'
    exports.colors.disabledIcon    = 'lightgray'
    exports.colors.enabledIcon     = '#00CC66'

    exports.client.defaultSimConfig = {}
    exports.client.defaultSimConfig.delayed    = { active:true,  icon:'⏰', text:'work slowly',       value:50                          } //🐌⌛
    exports.client.defaultSimConfig.exception  = { active:false, icon:'⚡',  text:'throw an exception', value:'fatal', pof:'atWork'       }
    exports.client.defaultSimConfig.stopWork   = { active:false, icon:'☠',  text:'stop working',                     pof:'atWork'       }
    //exports.client.defaultSimConfig.disconnect = { active:false, icon:'↛',  text:'disconnect',                       pof:'afterRequest' }
    exports.client.defaultSimConfig.delegate   = { active:false, icon:'☞',  text:'delegate to server'                                   }
    //exports.client.defaultSimConfig.ignore     = { active:false, icon:'🖕',  text:'ignore cancel request'                                }
    exports.client.defaultSimConfig.lognet     = { active:false, icon:'☍',  text:'log network messages'     } //ⶨ
    exports.client.defaultSimConfig.logjob     = { active:false, icon:'⥂',  text:'log reliable messages'    } //⇌
    exports.client.defaultSimConfig.logapp     = { active:true, icon:'⥴',   text:'log best-effort messages' } //⚘

    exports.server.defaultSimConfig = {}
    exports.server.defaultSimConfig.exception  = { active:false, icon:'⚡',  text:'throw an exception', value:'recoverable', pof:'beforeWork'   }
    exports.server.defaultSimConfig.stopWork   = { active:false, icon:'☠',  text:'stop working',                           pof:'beforeWork'   }
    //exports.server.defaultSimConfig.disconnect = { active:false, icon:'↛',  text:'disconnect',                             pof:'afterRequest' }
    //exports.server.defaultSimConfig.ignore     = { active:false, icon:'🖕',  text:'ignore cancel request'                                      }
    exports.server.defaultSimConfig.lognet     = { active:false, icon:'☍',  text:'log network messages'     }
    exports.server.defaultSimConfig.logjob     = { active:false, icon:'⥂',  text:'log reliable messages'    }
    exports.server.defaultSimConfig.logapp     = { active:true,  icon:'⥴',  text:'log best-effort messages' } // ⎎⚘
})
(typeof exports === 'undefined' ? this['config']={} : exports)
