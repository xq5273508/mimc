import {EnumCommand, EnumDevice, EnumStatus} from "./enum";
import {MIMCClient} from "./client";
import {Guid} from "../libs/utils";
import {SystemCommand, TransSystemCommand} from "./command";
import {Online} from "./online";
import {User} from "./user";
import {Events} from "./register";

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
    const user = MIMCClient.user = new User(MIMCClient.appId, MIMCClient.appAccount, MIMCClient.resource);
    user.onReceive((message) => {
      const notice_match = (/^<system_command,(\d+),([^>]+)>$/ig).exec(message.content);
      if (notice_match) {
        return TransSystemCommand(parseInt(notice_match[1]), notice_match[2]);
      }
      if (MIMCClient.timestamp > parseInt(message.timestamp)) {
        //普通消息时间小于初始化时间，不显示
        return;
      }
      Events.onReceiveMessage(message);
    });
    user.onStateChange((state, ...args) => {
      if (state === EnumStatus.Connected) {
        MIMCClient.timestamp = Date.now();
        const message = SystemCommand(EnumCommand.Online, {
          resource: MIMCClient.resource
        });
        user.send(MIMCClient.appAccount, message);
      }

      MIMCClient.state = state;
      Events.onStateChange(state, ...args);
    });
    user.onDisConn(() => {
      if (MIMCClient.state === EnumStatus.Elsewhere) {
        return;
      }
      MIMCClient.state = EnumStatus.DisConnect;
      Events.onStateChange(EnumStatus.DisConnect);
    });
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
    MIMCClient.user && await MIMCClient.user.login();
  }

  /**
   * 退出小米消息云登录
   */
  static async logout() {
    MIMCClient.user && await MIMCClient.user.logout();
    MIMCClient.timestamp = 0;
  }

  /**
   * 发送消息
   * @param toAccount     {string}    消息接收人编号（可以是群号）
   * @param message       {string}    消息内容
   * @param packetId      {string}    消息客户端ID
   * @param isGroup       {boolean}   是否是给群组发消息
   * @returns {*}
   */
  static send(toAccount, message, packetId = "", isGroup = false) {
    return MIMCClient.user.send(toAccount, message, packetId, isGroup);
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

  static get appId() {
    return MIMCClient.appId;
  }

  static getToken() {
    if (MIMCClient.state === EnumStatus.Connected)
      return MIMCClient.user.getToken();
    throw "用户未登录消息通信";
  }
}