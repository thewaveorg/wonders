export default {
  ipcChannels: {
    MAIN_CHANNEL_ASYNC: "main-process-async",
  },
  ipcMessages: {
    GET_WIDGETS: "get-widgets",
    LOAD_WIDGET: "load-widget",
    UNLOAD_WIDGET: "unload-widget",
    GET_LOADED_WIDGET: "get-loaded-widget",
    GET_ENABLED_WIDGET: "get-enabled-widget",
    ENABLE_WIDGET: "enable-widget",
    DISABLE_WIDGET: "disable-widget",
    ENABLE_ALL_WIDGETS: "enable-all-widgets",
    DISABLE_ALL_WIDGETS: "disable-all-widgets",
    RECEIVE_RELOAD_WIDGETS: "receive-reload-widgets",
    CLOSE_MAIN_WINDOW: "close-main-window",
    MAXIMIZE_MAIN_WINDOW: "maximize-main-window",
    MINIMIZE_MAIN_WINDOW: "minimize-main-window",
  }
};
