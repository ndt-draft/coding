(function() {
  // function to render apps in .contents
  function renderApps(data) {
    let contents = document.getElementsByClassName('contents')[0]

    let html = '<div class="apps list-group">'

    data.map(function(item) {
      html += '<li class="app list-group-item">'
        html += '<img class="app-thumbnail" src="' + item.thumbnailUrl + '">'
        html += item.name
      html += '</li>'
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

  // run
  renderApps(TABLE_DATA)
})()
