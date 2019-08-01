const mimc = require("../../loader/umd!../../loader/mimc!mimc-webjs-sdk/sdk/mimc-min_1_0_2");
import {EnumStatus} from "./enum";
import {Events} from "./register";
import {Guid, ToPromise} from "../libs/utils";

export function User(appId, appAccount, resource) {
  let receiveMessage;
  let stateChange = (status, ...args) => {

  };
  let disConn = (status, ...args) => {

  };
  const tobeSet = {};
  let loginPromise = {}, logoutPromise = {};

  /**
   * 接收小米消息
   * @param message     {Object}    消息对象
   * @param groupId     {string}    接收人是否为群（群消息会传入groupId）
   * @returns {undefined}
   * @constructor
   */
  function ReceiveMessage(message, groupId) {
    const content = message.getPayload();
    const timestamp = message.getTimeStamp();
    const sender = message.getFromAccount();
    const packetId = message.getPacketId();
    receiveMessage({packetId, timestamp, sender, content, groupId});
  }

  let user = new mimc.MIMCUser(appId, appAccount, resource);
  user.registerP2PMsgHandler(message => {
    ReceiveMessage(message);
  });
  user.registerGroupMsgHandler((message) => {
    const receiver = message.getTopicId();
    ReceiveMessage(message, receiver);
  });
  user.registerFetchToken(() => {
    return Events.onFetchToken(appAccount);
  });
  user.registerStatusChange((status, ...args) => {
    const {resolve, reject} = loginPromise;
    resolve && reject && (status ? resolve : reject)();
    loginPromise = {};
    stateChange(status ? EnumStatus.Connected : EnumStatus.DisConnect, ...args);
  });
  user.registerDisconnHandler(() => {
    const {resolve} = logoutPromise;
    resolve && resolve();
    logoutPromise = {};
    disConn();
  });
  user.registerServerAckHandler(
    /**
     *  发送消息后，服务器接收到消息ack的回调
     * @param packetId
     * @param sequence
     * @param timestamp
     * @param desc       （1）MSG_CHECK_ACCEPT 字段：表示消息被服务端正常接收。
     *                   （2）BLACKLIST_REFUSAL字段：表示发送者在黑名单中。
     *                   （3）MSG_CHECK_SENDER_NOT_IN_TOPIC字段：表示发送者不在群列表中。
     *                   （4）RUBBISH_MSG_REFUSAL：表示发送的消息中含有垃圾消息。（目前垃圾消息功能没有开启）
     *                   （5）P2P_MESSAGE_EXCEED_MAX_QPS字段：表示发送的消息超过qps限制。
     *                    (6) TOPIC_BLACKLIST_REFUSAL字段：表示向群里发送消息的人被群禁言了。
     * @constructor
     */
    (packetId, sequence, timestamp, desc) => {
      const promise = tobeSet[packetId];
      if (!promise) {
        return;
      }
      const {success, fail} = promise;
      if (desc === "MSG_CHECK_ACCEPT") {
        success({packetId, timestamp});
      }
      else {
        fail({packetId, timestamp, error: desc});
      }
    }
  );
  return {
    login() {
      return ToPromise((resolve, reject) => {
        if (loginPromise.reject) {
          loginPromise.reject();
        }
        loginPromise.resolve = resolve;
        loginPromise.reject = reject;
        user.login();
      });
    },
    logout() {
      return ToPromise((resolve, reject) => {
        if (logoutPromise.reject) {
          logoutPromise.reject();
        }
        logoutPromise.resolve = resolve;
        logoutPromise.reject = reject;
        user.logout();
      });
    },
    send(toAccount, message, packetId = "", isGroup = false) {
      toAccount = String(toAccount);
      return ToPromise((success, fail) => {
        if (!toAccount) {
          return;
        }
        packetId = packetId || Guid();
        tobeSet[packetId] = {success, fail};
        if (isGroup) {
          user.sendGroupMessage(toAccount, message, "json", undefined, packetId);
        }
        user.sendMessage(toAccount, message, undefined, undefined, packetId);
      });
    },
    getToken() {
      return user.getToken();
    },
    getAppAccount() {
      return user.getAppAccount();
    },
    onReceive(handler) {
      receiveMessage = handler;
    },
    onStateChange(handler) {
      stateChange = handler;
    },
    onDisConn(handler) {
      disConn = handler;
    }
  };
}