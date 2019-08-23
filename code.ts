// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = msg => {
  const selection = figma.currentPage.selection
  const pageChildren = figma.currentPage.children
  const nodes = []
  
  let obj: { componentName?: string; componentId?: string; instanceCount?: number; } = { 
    componentName: '',
    componentId: '',
    instanceCount: 0
  };
  
  // count instances
  // TODO: check for nested frames and groups
  if (msg.type === 'count-instances') {
    if (selection.length == 1) {
      let componentName = selection[0].name
      let componentId = selection[0].id

        // loop top level objects in the page
      for (let i = 0; i < pageChildren.length; i++) {
        const children = pageChildren[i];
        if (children.type === 'INSTANCE') {
          if (children.masterComponent.id === selection[0].id) {
            nodes.push(children)
            obj.instanceCount = nodes.length
          }
        }
      }

      figma.currentPage.selection = nodes
      obj.componentName = componentName
      obj.componentId = componentId
      figma.ui.postMessage(obj)
    }
  }

  // zoom to selection
  if (msg.type === 'zoom-instances') {
    if (figma.currentPage.selection.length > 0) {
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
    }
  }
};