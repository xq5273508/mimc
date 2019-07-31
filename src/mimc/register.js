const emptyHandler = (...args) => {
  console.warn("emptyHandler", args);
};

export const Events = {
  onReceiveMessage: emptyHandler,
  onFetchToken: emptyHandler,
  onStateChange: emptyHandler,
  onGroupNotice: emptyHandler,
  onSync: emptyHandler
};

export function Register(event, handler) {
  Events["on" + event] = handler || emptyHandler;
}