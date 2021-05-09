export interface IpcArguments {
    messageType: string | null;
    args: any[] | null;
}

export const getIpcArguments = (args: any): IpcArguments => {
    if (!Array.isArray(args)) {
        console.log(
          `IPC events have to pass an array of args. (Got ${args})`
          + "The array's first entry must be a string representing the message type.");

        return { messageType: null, args: null };
      }

    let messageType = args.shift();
    if (!messageType) {
        console.log("No IPC message type given. Ignoring...");
        return { messageType: null, args: null };
    }

    return { messageType, args: args[0] };
}