const { contextBridge, ipcRenderer } = require("electron");

const validChannels = ['ipc-example'];

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        myPing() {
            ipcRenderer.send('ipc-example', 'ping')
        },
        on(channel: string, func: Function) {
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        once(channel: string, func: Function) {
            if (validChannels.includes(channel)) {
                ipcRenderer.once(channel, (event, ...args) => func(...args));
            }
        }
    }
})