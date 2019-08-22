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
    const selection = figma.currentPage.selection;
    let pageChildren = figma.currentPage.children;
    const nodes = [];
    let obj = {
        componentName: '',
        componentId: '',
        instanceCount: 0
    };
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'count-instances') {
        if (selection.length == 1) {
            let componentName = selection[0].name;
            let componentId = selection[0].id;
            for (let i = 0; i < pageChildren.length; i++) {
                const children = pageChildren[i];
                if (children.type === 'INSTANCE') {
                    if (children.masterComponent.id === selection[0].id) {
                        nodes.push(children);
                        obj.instanceCount = nodes.length;
                    }
                }
            }
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            obj.componentName = componentName;
            obj.componentId = componentId;
            figma.ui.postMessage(obj);
        }
    }
};
