(function() {
  // function to render apps in .contents
  function renderApps(data) {
    console.log('render apps in .contents', data)
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
