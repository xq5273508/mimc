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

// export class MIMCRegister {
//
//   /**
//    * 接收消息注册
//    * @param handler
//    */
//   static set receiveMessage(handler) {
//     EVENTS["receiveMessage"] = handler;
//   }
//
//   static get receiveMessage() {
//     return EVENTS["receiveMessage"] || emptyHandler;
//   }
//
//   /**
//    * token生成方式
//    * @param handler
//    */
//   static set fetchToken(handler) {
//     EVENTS["fetchToken"] = handler;
//   }
//
//   static get fetchToken() {
//     return EVENTS["fetchToken"] || emptyHandler;
//   }
//
//   /**
//    * 状态改变时间注册
//    * @param handler
//    */
//   static set statusChange(handler) {
//     EVENTS["statusChange"] = handler;
//   }
//
//   static get statusChange() {
//     return EVENTS["statusChange"] || emptyHandler;
//   }
//
//   /**
//    * 多端数据同步事件注册
//    * @param handler
//    */
//   static set sync(handler) {
//     EVENTS["sync"] = handler;
//   }
//
//   static get sync() {
//     return EVENTS["sync"] || emptyHandler;
//   }
//
//   /**
//    * groupNotice生成方式
//    * @param handler
//    */
//   static set groupNotice(handler) {
//     EVENTS["groupNotice"] = handler;
//   }
//
//   static get groupNotice() {
//     return EVENTS["groupNotice"] || emptyHandler;
//   }
// }