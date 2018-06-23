(function() {
  let exam = {
    contents: document.querySelector('.contents'),
    input: document.querySelector('[name=apps]'),
    form: document.querySelector('form'),
    activeAppIndex: undefined,
    data: TABLE_DATA,
    apps: [],
    indexes: [],
    init() {
      // bind events
      this.bindEvents()

      // create app nodes
      this.apps = this.createAppNodes(this.data)

      this.indexes = this.data.map(function (item, index) {
        return index
      })

      // make local count data
      this.makeLocalCountData()

      // run
      this.renderApps(this.indexes)
    },
    bindEvents() {
      // add event listener to input
      this.input.addEventListener('input', this.handleInputApp.bind(this))

      this.input.addEventListener('keydown', this.handleKeyDownInput.bind(this))

      document.addEventListener('click', this.handleClickDocument.bind(this))

      this.form.addEventListener('submit', this.handleSubmitForm.bind(this))

      // add click event to each app
      this.contents.addEventListener('click', this.handleClickApp.bind(this))

      this.contents.addEventListener('mousemove', this.handleMouseMoveApp.bind(this))
    },
    // function to filter apps by keyword and re-render in .contents
    handleInputApp(event) {
      let keyword = event.target.value.trim().toLowerCase()

      let suggestIndexes = this.data.map(function (item, index) {
        return {
          index: index,
          // https://stackoverflow.com/a/1789952
          suggest: item.name.toLowerCase().indexOf(keyword) >= 0
        }
      })

      suggestIndexes = suggestIndexes.filter(function(item) {
        return item.suggest
      }).map(function(item) {
        return item.index
      })

      // remove active class if available
      let apps = this.getAppNodes()
      if (apps[this.activeAppIndex]) {
        apps[this.activeAppIndex].classList.remove('active-app')
      }

      this.renderApps(suggestIndexes)
    },
    handleKeyDownInput(e) {
      let apps = this.getAppNodes()
      let activeAppIndex = this.activeAppIndex

      switch (e.keyCode) {
        // arrow up or down
        // allow jump to the first app when reachs the last app and vice versa
        case 38:
        case 40:
          if (this.activeAppIndex === undefined) {
            // no active app
            // press arrow down set first app active
            // press arrow up set last app active
            activeAppIndex = (e.keyCode === 38) ? (apps.length - 1) : 0
          // arrow up
          } else if (e.keyCode === 38) {
            activeAppIndex = (activeAppIndex + apps.length - 1) % apps.length
          // arrow down
          } else if (e.keyCode === 40) {
            activeAppIndex = (activeAppIndex + 1) % apps.length
          }

          this.selectApp(apps[activeAppIndex])
          break

        // enter
        case 13:
          if (apps[activeAppIndex]) {
            this.updateAppInput(apps[activeAppIndex].getAttribute('data-name'))
            this.countSelectApp(apps[activeAppIndex])
          }
          break

        // esc
        case 27:
          this.input.blur()
          this.contents.classList.add('hide')
          break
      }
    },
    handleClickDocument(e) {
      if (e.target === this.input || this.contents.contains(e.target)) {
        this.contents.classList.remove('hide')
      } else {
        this.contents.classList.add('hide')
      }
    },
    handleSubmitForm(e) {
      e.preventDefault()
    },
    handleClickApp(e) {
      this.selectApp(e.target, {
        updateAppInput: true
      })
      this.countSelectApp(e.target)
    },
    handleMouseMoveApp(e) {
      this.selectApp(e.target, {
        mousemove: true
      })
    },
    createAppNodes(data) {
      return data.map(function(item) {
        let app = document.createElement('div')
        app.className = 'app list-group-item'
        app.id = item.id
        app.setAttribute('data-name', item.name)

        let img = document.createElement('img')
        img.className = 'app-thumbnail'
        img.src = item.thumbnailUrl

        let badge = document.createElement('span')
        badge.className = 'badge'

        let name = document.createTextNode(item.name)

        app.appendChild(img)
        app.appendChild(name)
        app.appendChild(badge)

        return app
      })
    },
    getAppNodes() {
      let nodes = []
      this.contents.childNodes.forEach(function(node) {
        if (node.nodeName === 'DIV') {
          nodes.push(node)
        }
      })
      return nodes
    },
    updateAppInput(value) {
      this.input.value = value
      this.input.focus()
    },
    makeLocalCountData() {
      let localData = []

      if (localStorage.data) {
        localData = JSON.parse(localStorage.data)
      }

      this.data.map(function (app, index) {
        let localAppIndex = localData.findIndex(function (localApp) {
          return localApp.id === app.id
        })

        if (localAppIndex < 0) {
          localData.splice(index, 0, {
            id: app.id,
            // name: app.name,
            count: 0
          })
        }
      })

      localStorage.data = JSON.stringify(localData)
    },
    countSelectApp(appNode) {
      let data = JSON.parse(localStorage.data)

      let localIndex = data.findIndex(function (item) {
        return item.id === appNode.id
      })

      if (localIndex < 0) {
        return
      }

      // found, just increase
      data[localIndex].count += 1

      let badge = appNode.lastChild
      badge.textContent = data[localIndex].count

      localStorage.data = JSON.stringify(data)
    },
    // function to select app
    selectApp(targetNode, options = {}) {
      if(targetNode && targetNode.className.indexOf('app') >= 0) {
        let apps = this.getAppNodes()

        // find target index
        let targetIndex = apps.findIndex(function(app) {
          return app === targetNode
        })

        // cancel if mousemove on active app
        if (targetIndex === this.activeAppIndex && options.mousemove) {
          return
        }

        // remove active class if target index is different from current active app index
        if (this.activeAppIndex !== undefined && this.activeAppIndex !== targetIndex) {
          apps[this.activeAppIndex].classList.remove('active-app')
        }

        // add active class to current target
        targetNode.classList.add('active-app')

        // update input field value with corresponding app name
        if (options.updateAppInput) {
          this.updateAppInput(targetNode.getAttribute('data-name'))
        }

        // save active app index
        this.activeAppIndex = targetIndex
      }
    },
    // function to render apps in .contents
    renderApps(suggestionIndexes) {
      let nonSuggestionIndexes = this.indexes.filter(function (index) {
        return suggestionIndexes.indexOf(index) < 0
      })

      nonSuggestionIndexes.map(function (index) {
        exam.apps[index].remove()
      })

      let appIds = suggestionIndexes.map(function (index) {
        return exam.apps[index].id
      })

      let countData = JSON.parse(localStorage.data)

      // sort by most count
      let sortCountData = countData.slice()
      sortCountData.sort(function (a, b) {
        return b.count - a.count
      })

      let appIdsByCount = sortCountData.map(function (item) {
        return item.id
      })

      let orderAppIds = appIdsByCount.filter(function (id) {
        return appIds.indexOf(id) >= 0
      })

      let orderIndexes = orderAppIds.map(function (id) {
        return exam.apps.findIndex(function (app) {
          return app.id === id
        })
      })

      // sort app nodes by most select app
      orderIndexes.map(function (orderIndex) {
        exam.contents.appendChild(exam.apps[orderIndex])

        let badge = exam.apps[orderIndex].lastChild
        let id = exam.apps[orderIndex].id
        let localAppIndex = countData.findIndex(function (item) {
          return item.id === id
        })
        badge.textContent = countData[localAppIndex].count || ''
      })

      // reset active index
      this.activeAppIndex = undefined
    },
  }

  // run the exam
  exam.init()
})()
