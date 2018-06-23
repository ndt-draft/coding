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
            this.updateAppInput(apps[activeAppIndex].textContent)
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
    },
    createAppNodes(data) {
      return data.map(function(item) {
        let app = document.createElement('div')
        app.className = 'app list-group-item'

        let img = document.createElement('img')
        img.className = 'app-thumbnail'
        img.src = item.thumbnailUrl

        let name = document.createTextNode(item.name)

        app.appendChild(img)
        app.appendChild(name)

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
    // function to select app
    selectApp(targetNode, options = {}) {
      if(targetNode && targetNode.className.indexOf('app') >= 0) {
        let apps = this.getAppNodes()

        // find target index
        let targetIndex = apps.findIndex(function(app) {
          return app === targetNode
        })

        // cancel click active app
        if (this.activeAppIndex === targetIndex) {
          return
        }

        // remove active class from old active app
        if (this.activeAppIndex !== undefined) {
          apps[this.activeAppIndex].classList.remove('active-app')
        }

        // add active class to current target
        targetNode.classList.add('active-app')

        // update input field value with corresponding app name
        if (options.updateAppInput) {
          this.updateAppInput(targetNode.textContent)
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

      suggestionIndexes
        .filter(function(index) {
          return !exam.contents.contains(exam.apps[index])
        })
        .map(function (index) {
          exam.apps[index].classList.remove('active-app')
          exam.contents.appendChild(exam.apps[index])
        })

      // reset active index
      this.activeAppIndex = undefined
    },
  }

  // run the exam
  exam.init()
})()
