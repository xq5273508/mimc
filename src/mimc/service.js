const mimc = require("../../loader/umd!../../loader/mimc!mimc-webjs-sdk/sdk/mimc-min_1_0_2");
import {EnumCommand, EnumDevice, EnumStatus} from "./enum";
import {MIMCClient, StateChange} from "./client";
import {ReceiveMessage, SendMessage, SendCallback} from "./message";
import {Events} from "./register";
import {Guid} from "../libs/utils";
import {Token} from "../libs/ajax";
import {SystemCommand} from "./command";
import {Online} from "./online";

/**
 * 初始化小米消息云客户端，绑定各类事件
 * @returns {Promise<void>}
 * @constructor
 */
async function Init() {
  if (!MIMCClient.user) {
    MIMCClient.state = EnumStatus.None;
    MIMCClient.timestamp = 0;
    MIMCClient.resource = Guid(MIMCClient.device, 4);
    const user = MIMCClient.user = new mimc.MIMCUser(MIMCClient.appId, MIMCClient.appAccount, MIMCClient.resource);
    user.registerP2PMsgHandler(message => {
      ReceiveMessage(message);
    });
    user.registerGroupMsgHandler((message) => {
      const receiver = message.getTopicId();
      ReceiveMessage(message, receiver);
    });
    user.registerFetchToken(Events.onFetchToken);
    user.registerStatusChange((status, ...args) => {
      if (status) {
        Token.token = user.getToken();
        MIMCClient.timestamp = Date.now();
        const message = SystemCommand(EnumCommand.Online, {
          resource: MIMCClient.resource
        });
        SendMessage(MIMCClient.appAccount, message);
      }
      StateChange(status ? EnumStatus.Connected : EnumStatus.DisConnect, ...args);
    });
    user.registerDisconnHandler(() => {
      MIMCClient.status !== EnumStatus.Elsewhere && StateChange(EnumStatus.DisConnect);
    });
    user.registerServerAckHandler(SendCallback);
  }
}

export class MIMCService {

  /**
   * 小米消息云数据初始化，初次登录或者切换用户时调用
   * @param appId       {string}      小米消息云appId
   * @param appAccount  {string}      要登录小米消息云的用户账号
   * @param device      {EnumDevice}  当前登录的设备类型，用来处理账号在同一类设备只能登录一次，小米消息云中的resource前4位为device信息
   */
  static config(appId, appAccount, device = EnumDevice.Mobile) {
    MIMCClient.user = null;
    MIMCClient.appId = appId;
    MIMCClient.appAccount = appAccount;
    MIMCClient.device = device;
  }

  /**
   * 登录小米消息云
   * @returns {Promise<void>}
   */
  static async login() {
    await Init();
    MIMCClient.user && MIMCClient.user.login();
  }

  /**
   * 退出小米消息云登录
   */
  static logout() {
    MIMCClient.user && MIMCClient.user.logout();
    MIMCClient.timestamp = 0;
  }

  /**
   * 发送消息
   * @param toAccount     {string}    消息接收人编号（可以是群号）
   * @param message       {string}    消息内容
   * @param packetId      {string}    消息类型
   * @param isGroup       {boolean}   是否是给群组发消息
   * @returns {*}
   */
  static send(toAccount, message, packetId = 1, isGroup = false) {
    return SendMessage(toAccount, message,packetId, isGroup);
  }

  /**
   * 查询用户在线状态
   * @param accounts     {string}       要查询的用户
   * @param device       {EnumDevice}   要查询的设备
   * @returns {Promise<*>}
   */
  static online(accounts, device = EnumDevice.Mobile) {
    return Online(accounts, device);
  }
}