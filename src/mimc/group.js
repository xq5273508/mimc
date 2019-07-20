import {GetAsync, DeleteAsync, PostAsync} from "../libs/ajax";
import {MIMCClient} from "./client";
import {SendMessage} from "./message";
import {EnumCommand, EnumGroupNotice} from "./enum";
import {SystemCommand} from "./command";

/**
 * 构造群通知
 * @param id        {string}          群号
 * @param notice    {EnumGroupNotice} 群通知类型
 * @param props     {object}          群通知扩展属性
 * @returns {string}
 */
function notice_message_format(id, notice, props = {}) {
  props = Object.assign(props, {notice, id});
  return SystemCommand(EnumCommand.GroupNotice, props);
}

/**
 * 通过群发送消息实现群通知
 * @param id        {string}          群号
 * @param notice    {EnumGroupNotice} 群通知类型
 * @param props     {object}          群通知扩展属性
 * @returns {Promise<void>}
 * @constructor
 */
async function SendGroupNotice(id, notice, props = {}) {
  const message = notice_message_format(id, notice, props);
  await SendMessage(id, message, true);
}

/**
 * 群通知实现：先发送群通知格式的消息再进行群操作
 * 看群通知是否全部收到，如果有问题的话，要改成先获取群成员列表，然后操作群，然后根据群成员列表挨个发消息
 */
export class GroupService {
  /**
   * 获取加入的群列表
   * @returns {Promise<void>}
   */
  static async list() {
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/account`;
    const result = await GetAsync(url);
    return result.data;
  }

  /**
   * 获取群详情
   * @param id    {string}  群号
   * @returns {Promise<void>}
   */
  static async info(id) {
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/${id}`;
    const result = await GetAsync(url);
    return result.data;
  }

  /**
   * 创建群
   * @param name      {string}  群名称
   * @param members   {string}  群成员id列表（,连接）
   * @returns {Promise<*>}
   */
  static async create(name, members) {
    const data = {topicName: name, accounts: members};
    const url = 'https://mimc.chat.xiaomi.net/api/topic/' + MIMCClient.appId;
    const result = await PostAsync(url, data);
    const id = result.data.topicInfo.topicId;
    SendGroupNotice(id, EnumGroupNotice.Join, {members, mode: "create"});
    return id;
  }

  /**
   * 邀请成员加入群，不需要被邀请人同意，直接加入群
   * @param id        {string}  群编号
   * @param members   {string}  群成员id列表（,连接）
   * @returns {Promise<*>}
   */
  static async invite(id, members) {
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/${id}/accounts`;
    const info = await PostAsync(url, {accounts: members});
    SendGroupNotice(id, EnumGroupNotice.Join, {members, mode: "invite"});
    return info;
  }

  /**
   * 申请入群
   * @param id      {string}  群号
   * @param owner   {string}  群主
   * @param remark  {string}  申请备注
   * @returns {Promise<void>}
   */
  static async apply(id, owner,remark) {
    const message = notice_message_format(id, EnumGroupNotice.ApplyJoin,{remark});
    await SendMessage(owner, message);
  }

  /**
   * 申请入群回复
   * @param id      {string}  群号
   * @param member  {string}  申请人
   * @param agree   {boolean} 同意
   * @returns {Promise<void>}
   */
  static async reply(id, member, agree = true) {
    if (agree) {
      await SendGroupNotice(id, EnumGroupNotice.Join, {members: String(member), mode: "apply"})
    }
    else {
      const message = notice_message_format(id, EnumGroupNotice.ApplyJoinReply, {agree});
      await SendMessage(member, message);
    }
  }

  /**
   * 删除群成员
   * @param id      {string}    群号
   * @param members {string}    要踢的群成员id列表（,连接）
   * @returns {Promise<*>}
   */
  static async remove(id, members) {
    SendGroupNotice(id, EnumGroupNotice.MemberRemove, {members});
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/${id}/accounts?accounts=${members}`;
    return await DeleteAsync(url);
  }

  /**
   * 退群
   * @param id      {string}    群号
   * @returns {Promise<*>}
   */
  static async quit(id) {
    SendGroupNotice(id, EnumGroupNotice.MemberQuit, {});
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/${id}/account`;
    return await DeleteAsync(url);
  }

  /**
   * 解散群
   * @param id      {string}    群号
   * @returns {Promise<void>}
   */
  static async dismiss(id) {
    SendGroupNotice(id, EnumGroupNotice.Dismiss, {});
    const url = `https://mimc.chat.xiaomi.net/api/topic/${MIMCClient.appId}/${id}`;
    await DeleteAsync(url);
  }
}