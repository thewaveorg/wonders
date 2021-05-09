export interface IpcArguments {
  messageType: string | null;
  args: any[] | null;
}

export const getIpcArguments = (args: any): IpcArguments => {
  // args = [ messageType, ...arguments ];

  if (!Array.isArray(args)) {
    console.log(
      `IPC events must send an array of args with the format [ messageType, ...arguments ]. (Got ${args})`);

    return {
      messageType: null,
      args: null
    };
  }

  let messageType = args.shift();
  if (!messageType) {
    console.log(`No IPC message type given. Ignoring... (Got ${args})`);
    return {
      messageType: null,
      args: null
    };
  }

  return {
    messageType,
    args: args[0]
  };
}
