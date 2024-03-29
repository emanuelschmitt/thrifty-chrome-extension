const pageTitle = document.title
chrome.runtime.sendMessage({
  method: 'dom',
  data: {
    pageTitle,
  },
})
