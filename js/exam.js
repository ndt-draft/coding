(function() {
  let contents = document.querySelector('.contents')
  let input = document.querySelector('[name=apps]')
  let form = document.querySelector('form')
  let activeAppIndex

  // function to render apps in .contents
  function renderApps(data) {
    let html = '<div class="app-list list-group">'

    data.map(function(item) {
      html += '<div class="app list-group-item">'
        html += '<img class="app-thumbnail" src="' + item.thumbnailUrl + '">'
        html += item.name
      html += '</div>'
    })

    html += '</div>'

    // DANGER
    contents.innerHTML = html

    // reset active index
    activeAppIndex = undefined
  }

  // function to filter apps by keyword and re-render in .contents
  function suggestAppsByKeyword(event) {
    let keyword = event.target.value.trim().toLowerCase()

    let suggestions = TABLE_DATA.filter(function(item) {
      // https://stackoverflow.com/a/1789952
      return item.name.toLowerCase().indexOf(keyword) >= 0
    })

    renderApps(suggestions)
  }

  // add event listener to input
  input.addEventListener('input', suggestAppsByKeyword)

  input.addEventListener('keydown', function (e) {
    let apps = contents.childNodes[0].childNodes
    let activeIndex = activeAppIndex

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

        if (activeAppIndex === undefined) {
          activeIndex = 0
        }

        selectApp(apps[activeIndex])
        break

      // enter
      case 13:
        if (apps[activeAppIndex]) {
          updateAppInput(apps[activeAppIndex].textContent)
        }
        break
    }
  })

  document.addEventListener('click', function (e) {
    if (e.target === input || contents.contains(e.target)) {
      contents.classList.remove('hide')
    } else {
      contents.classList.add('hide')
    }
  })

  form.addEventListener('submit', function (e) {
    e.preventDefault()
  })

  // function to select app
  function selectApp(targetNode, options = {}) {
    if(targetNode && targetNode.nodeName == "DIV") {
      let apps = contents.childNodes[0].childNodes

      // remove active class from old active app
      if (activeAppIndex !== undefined) {
        apps[activeAppIndex].classList.remove('active-app')
      }

      // add active class to current target
      targetNode.classList.add('active-app')

      // update input field value with corresponding app name
      if (options.updateAppInput) {
        updateAppInput(targetNode.textContent)
      }

      // find app index
      // https://stackoverflow.com/a/5913984
      let targetIndex = 0;
      let target = targetNode
      while( (target = target.previousSibling) != null ) {
        targetIndex++;
      }

      // save active app index
      activeAppIndex = targetIndex
    }
  }

  function updateAppInput(value) {
    input.value = value
    input.focus()
  }

  // add click event to each app
  contents.addEventListener('click', function(e) {
    selectApp(e.target, {
      updateAppInput: true
    })
  })

  // run
  renderApps(TABLE_DATA)
})()
