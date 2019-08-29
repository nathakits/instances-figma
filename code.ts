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

// TODO: 
// make a function to find all page nodes and store that locally or in an array?
// then use count-instances to access the array

// Can either be incorporated into the count button to first calculate then count
// if the cache is the same then don't have to recalculate

// TODO:
// delete option if component doesn't have instances

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
    if (selection.length === 1 && selection[0].type === "COMPONENT") {
      let componentName = selection[0].name
      let componentId = selection[0].id

        // loop top level objects in the page
      for (let i = 0; i < pageChildren.length; i++) {
        const children = pageChildren[i];
        
        // INSTANCE
        // count top-level instances - depth 1
        if (children.type === 'INSTANCE') {
          if (children.masterComponent.id === selection[0].id) {
            nodes.push(children)
            obj.instanceCount = nodes.length
          } else {
            const frameChild = children.children
            for (let i = 0; i < frameChild.length; i++) {
              const child = frameChild[i];

              if (child.type === 'INSTANCE') {
                if (child.masterComponent.id === selection[0].id) {
                  nodes.push(child)
                  obj.instanceCount = nodes.length
                }
              }

              // group within a group - depth 3
              if (child.type === 'GROUP') {
                const nestGroupChild = child.children
                for (let i = 0; i < nestGroupChild.length; i++) {
                  const child = nestGroupChild[i];
                  if (child.type === 'INSTANCE') {
                    if (child.masterComponent.id === selection[0].id) {
                      nodes.push(child)
                      obj.instanceCount = nodes.length
                    }
                  }
                }
              }

            }
          }
        }

        // GROUPS
        // count nested groups - depth 2
        if (children.type === 'GROUP') {
          const groupChild = children.children
          for (let i = 0; i < groupChild.length; i++) {
            const child = groupChild[i];

            if (child.type === 'INSTANCE') {
              if (child.masterComponent.id === selection[0].id) {
                nodes.push(child)
                obj.instanceCount = nodes.length
              }
            }

            // group within a group - depth 3
            if (child.type === 'GROUP') {
              const nestGroupChild = child.children
              for (let i = 0; i < nestGroupChild.length; i++) {
                const child = nestGroupChild[i];
                if (child.type === 'INSTANCE') {
                  if (child.masterComponent.id === selection[0].id) {
                    nodes.push(child)
                    obj.instanceCount = nodes.length
                  }
                }
              }
            }
          }
        }

        // FRAMES
        // count nested frame - depth 2
        if (children.type === 'FRAME') {
          const frameChild = children.children
          for (let i = 0; i < frameChild.length; i++) {
            const child = frameChild[i];

            if (child.type === 'INSTANCE') {
              if (child.masterComponent.id === selection[0].id) {
                nodes.push(child)
                obj.instanceCount = nodes.length
              }
            }

            // group within a group - depth 3
            if (child.type === 'GROUP') {
              const nestGroupChild = child.children
              for (let i = 0; i < nestGroupChild.length; i++) {
                const child = nestGroupChild[i];
                if (child.type === 'INSTANCE') {
                  if (child.masterComponent.id === selection[0].id) {
                    nodes.push(child)
                    obj.instanceCount = nodes.length
                  }
                }
              }
            }

          }
        }

        // COMPONENTS
        // count nested component - depth 2
        if (children.type === 'COMPONENT') {
          const frameChild = children.children
          for (let i = 0; i < frameChild.length; i++) {
            const child = frameChild[i];

            if (child.type === 'INSTANCE') {
              if (child.masterComponent.id === selection[0].id) {
                nodes.push(child)
                obj.instanceCount = nodes.length
              }
            }

            // group within a group - depth 3
            if (child.type === 'GROUP') {
              const nestGroupChild = child.children
              for (let i = 0; i < nestGroupChild.length; i++) {
                const child = nestGroupChild[i];
                if (child.type === 'INSTANCE') {
                  if (child.masterComponent.id === selection[0].id) {
                    nodes.push(child)
                    obj.instanceCount = nodes.length
                  }
                }
              }
            }

          }
        }

      }

      figma.currentPage.selection = nodes
      obj.componentName = componentName
      obj.componentId = componentId
      figma.ui.postMessage(obj)
    } else {
      figma.notify("Please select 1 Component object")
    }
  }

  // zoom to selection
  if (msg.type === 'zoom-instances') {
    if (figma.currentPage.selection.length > 0) {
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
    } else {
      figma.notify("Please select more than 1 object to zoom")
    }
  }
};

let count = 0
function traverse(node) {
  // if the node has children
  if ("children" in node) {
    count++
    for (const child of node.children) {
      traverse(child)
    }
  }
}

// traverse page
function walker(children:any, selection:Array<any>, nodeType:string, nodes:Array<any>, obj:any) {
  if (nodeType === 'INSTANCE') {
    if (children.masterComponent.id === selection[0].id) {
      nodes.push(children)
      obj.instanceCount = nodes.length
    } else {
      const frameChild = children.children
      for (let i = 0; i < frameChild.length; i++) {
        const child = frameChild[i];

        if (child.type === 'INSTANCE') {
          if (child.masterComponent.id === selection[0].id) {
            nodes.push(child)
            obj.instanceCount = nodes.length
          }
        }

        // group within a group - depth 3
        if (child.type === 'GROUP') {
          const nestGroupChild = child.children
          for (let i = 0; i < nestGroupChild.length; i++) {
            const child = nestGroupChild[i];
            if (child.type === 'INSTANCE') {
              if (child.masterComponent.id === selection[0].id) {
                nodes.push(child)
                obj.instanceCount = nodes.length
              }
            }
          }
        }

      }
    }
  }
}