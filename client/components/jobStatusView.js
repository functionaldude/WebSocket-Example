 function jobStatusView(jid)
 {
     var jjid  = 'j' + jid     
     var progressid = jjid + '-progress'
     var lastlogid  = jjid + '-lastlog'
     var logid      = jjid + '-log'
     var subjobsid  = jjid + '-subjobs'

     var node = document.createElement('div')
     var headerLine = document.createElement('div')
         var lastworker = document.createElement('div')
         var progress = document.createElement('div')
         var lastlog = document.createElement('div')
         var state = document.createElement('div')
     var log = document.createElement('ul')
     var subjobs = document.createElement('div')

     var map =
     {
         requests:        '☞',
         delegates:       '☞',
         canceling:       '☞✗',
         recovering:      '⚠',
         found:           '•',
         compared:        '',
         ok:              '✓',
         canceled:        '✗',
         fatal:           '⚡',
         recoverable:     '⛈',
         failed:          '⛐',
         timeout:         '☠'
     }

     node.id = jjid     
     node.className = 'jobStatus'
     node.appendLog = function(j)
     {
         progress.appendLog(j)
         lastworker.innerText = j.state.lastWorker
         lastlog.innerText = j.state.log         
         state.innerText = map[j.state.type]
         log.appendLog(j)
     }

     state.className = 'jobState'
     state.innerText = '-'
     state.onclick = function()
     {
         $('.log').not('#'+logid).hide()
         $('#'+logid).toggle()         
     }

     lastworker.className = 'lastWorker'
     lastworker.innerText = '-'
     lastworker.onclick = state.onclick

     progress.id = progressid
     progress.className = 'search-progress'
     progress.onclick = state.onclick
     progress.appendLog = function(j)
     {
         var originTail = j
         while (originTail.origin)
             originTail = originTail.origin
         var colorj = originTail
         var prevProgress = $('#' + progressid).data('progress')
         var left = prevProgress ? prevProgress * 130 : 0
         var width = Math.ceil(j.state.progress * 130) - left

         var logBlock = document.createElement('div')
         logBlock.className = 'search-progress-block'
         logBlock.style.backgroundColor = config.colors[colorj.state.type]
         logBlock.style.left = Math.floor(left)
         logBlock.style.width = Math.ceil(width)
         progress.appendChild(logBlock)
         $('#' + progressid).data('progress', j.state.progress)
     }

     lastlog.id = lastlogid
     lastlog.className = 'searchStatusText'
     lastlog.innerText = 'undefined'
     lastlog.onclick = state.onclick

     log.id = logid
     log.className = "log"
     log.openTime = new Date()
     log.appendLog = function(j)
     {
         var originTail = j
         var li = document.createElement('li')
         li.insertHop = function(j)
         {
             originTail = j
             var head = document.createElement('div')
             head.innerText = j.state.lastWorker + ' J' + j.id.toSubscript()
             head.className = 'head'
             head.style.borderLeftColor = config.colors[j.state.type]
             li.appendChild(head)

             if (j.origin)
                 li.insertHop(j.origin)
         }
         li.insertHop(j)

         var logText = document.createElement('div')
         logText.innerText = originTail.state.log
         logText.className = 'logText'

         var logState = document.createElement('div')
         logState.innerText = map[originTail.state.type]
         logState.className = 'logText'
         logState.style.float = 'right'

         var logProgress = document.createElement('div')
         logProgress.innerText = j.state.progress.toFixed(2)
         logProgress.className = 'logText'
         logProgress.style.float = 'right'

         var logTime = document.createElement('div')
         logTime.innerText = new Date() - log.openTime
         logTime.className = 'logText'
         logTime.style.float = 'right'

         li.appendChild(logTime)
         li.appendChild(logProgress)
         li.appendChild(logText)
         li.appendChild(logState)
         log.appendChild(li)
     }

     subjobs.id = subjobsid
     subjobs.className = "subjobs"

         node.appendChild(progress)
         node.appendChild(lastworker)
         node.appendChild(lastlog)
         node.appendChild(state)
     node.appendChild(headerLine)
     node.appendChild(log)
     node.appendChild(subjobs)

     return node
 }
