(function() {
  let contents = document.getElementsByClassName('contents')[0]

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
  let input = document.getElementsByName('apps')[0]
  input.addEventListener('input', suggestAppsByKeyword)

  let activeAppIndex
  // function to select app
  function selectApp(e) {
    let apps = contents.childNodes[0].childNodes
    if(e.target && e.target.nodeName == "DIV") {
      // remove active class from old active app
      if (activeAppIndex !== undefined) {
        apps[activeAppIndex].classList.remove('active-app')
      }

      // add active class to current target
      e.target.classList.add('active-app')

      // update input field value with corresponding app name
      input.value = e.target.textContent

      // find app index
      // https://stackoverflow.com/a/5913984
      let targetIndex = 0;
      let target = e.target
      while( (target = target.previousSibling) != null ) {
        targetIndex++;
      }

      // save active app index
      activeAppIndex = targetIndex
    }
  }

  // add click event to each app
  contents.addEventListener('click', selectApp)

  // run
  renderApps(TABLE_DATA)
})()
