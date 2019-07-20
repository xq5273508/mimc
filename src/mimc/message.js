import {Events} from "./register";
import {MIMCClient} from "./client";
import {TransSystemCommand} from "./command";
import {Guid, ToPromise} from "../libs/utils";

const MessageSet = {};

/**
 * 消息发送
 * @param to            {string}  消息发送给（可以为群号）
 * @param message       {string}  消息文本
 * @param packetId      {string}  消息客户端编号
 * @param is_group      {boolean} 是否群组消息
 * @returns {Promise}
 * @constructor
 */
export function SendMessage(to, message, packetId, is_group = false) {
  return ToPromise((success, fail) => {
    if (!to) {
      return;
    }
    packetId = packetId || Guid();
    if (is_group) {
      MIMCClient.user.sendGroupMessage(to, message, "json", undefined, packetId);
    }
    MIMCClient.user.sendMessage(to, message, undefined, undefined, packetId);
    MessageSet[packetId] = {success, fail};
  });
}

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
export function SendCallback(packetId, sequence, timestamp, desc) {
  const promise = MessageSet[packetId];
  if (!promise) {
    return;
  }
  const {success, fail} = promise;
  if (desc === "MSG_CHECK_ACCEPT") {
    success(packetId);
  }
  else {
    fail(desc);
  }
}

/**
 * 接收小米消息
 * @param message     {Object}    消息对象
 * @param groupId     {string}    接收人是否为群（群消息会传入groupId）
 * @returns {undefined}
 * @constructor
 */
export function ReceiveMessage(message, groupId) {
  const content = message.getPayload();
  const notice_match = (/^<system_command,(\d+),([^>]+)>$/ig).exec(content);
  if (notice_match) {
    return TransSystemCommand(parseInt(notice_match[1]), notice_match[2]);
  }
  const time = message.getTimeStamp();
  const sender = message.getFromAccount();
  const packetId = message.getPacketId();
  if (MIMCClient.timestamp > parseInt(time)) {
    //普通消息时间小于初始化时间，不显示
    return;
  }
  Events.onReceiveMessage({packetId, time, sender, content: content, groupId});
}