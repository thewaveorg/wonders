export default {
  ipcChannels: {
    MAIN_CHANNEL_ASYNC: "main-process-async",
  },
  ipcMessages: {
    GET_WIDGETS: "get-widgets",
    RECEIVE_WIDGETS: "receive-widgets",
    UNLOAD_WIDGET: "unload-widget",
    LOAD_WIDGET: "load-widget",
    GET_LOADED_WIDGET: "get-loaded-widget",
    RECEIVE_LOADED_WIDGET: "receive-loaded-widget",
    GET_ACTIVE_WIDGET: "get-active-widget",
    RECEIVE_ACTIVE_WIDGET: "receive-active-widget",
    ACTIVATE_WIDGET: "activate-widget",
    DEACTIVATE_WIDGET: "deactivate-widget",
    RECEIVE_WIDGET_UPDATES: "receive-widget-updates",
    CLOSE_MAIN_WINDOW: "close-main-window",
    MAXIMIZE_MAIN_WINDOW: "maximize-main-window",
    MINIMIZE_MAIN_WINDOW: "minimize-main-window",
  }
};
