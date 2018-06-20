(function() {
  let exam = {
    contents: document.querySelector('.contents'),
    input: document.querySelector('[name=apps]'),
    form: document.querySelector('form'),
    activeAppIndex: undefined,
    init() {
      // bind events
      this.bindEvents()

      // run
      this.renderApps(TABLE_DATA)
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

      let suggestions = TABLE_DATA.filter(function(item) {
        // https://stackoverflow.com/a/1789952
        return item.name.toLowerCase().indexOf(keyword) >= 0
      })

      this.renderApps(suggestions)
    },
    handleKeyDownInput(e) {
      let apps = this.contents.childNodes[0].childNodes
      let activeIndex = this.activeAppIndex

      switch (e.keyCode) {
        // arrow up or down
        case 38:
        case 40:
          // up
          if (e.keyCode === 38) {
            activeIndex--
          // down
          } else if (e.keyCode === 40) {
            activeIndex++
          }

          if (this.activeAppIndex === undefined) {
            activeIndex = 0
          }

          this.selectApp(apps[activeIndex])
          break

        // enter
        case 13:
          if (apps[this.activeAppIndex]) {
            this.updateAppInput(apps[this.activeAppIndex].textContent)
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
    updateAppInput(value) {
      this.input.value = value
      this.input.focus()
    },
    // function to select app
    selectApp(targetNode, options = {}) {
      if(targetNode && targetNode.nodeName == "DIV") {
        let apps = this.contents.childNodes[0].childNodes

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

        // find app index
        // https://stackoverflow.com/a/5913984
        let targetIndex = 0;
        let target = targetNode
        while( (target = target.previousSibling) != null ) {
          targetIndex++;
        }

        // save active app index
        this.activeAppIndex = targetIndex
      }
    },
    // function to render apps in .contents
    renderApps(data) {
      let html = '<div class="app-list list-group">'

      data.map(function(item) {
        html += '<div class="app list-group-item">'
          html += '<img class="app-thumbnail" src="' + item.thumbnailUrl + '">'
          html += item.name
        html += '</div>'
      })

      html += '</div>'

      // DANGER
      this.contents.innerHTML = html

      // reset active index
      this.activeAppIndex = undefined
    },
  }

  // run the exam
  exam.init()
})()
