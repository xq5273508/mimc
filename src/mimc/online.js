import {EnumDevice} from "./enum";
import {PostAsync} from "../libs/ajax";
import {MIMCClient} from "./client";

const OnlineSet = {};

/**
 * 查询用户在线状态
 * @param accounts     {string}       要查询的用户
 * @param device       {EnumDevice}   要查询的设备
 * @returns {Promise<{online: Array, offline: Array}>}
 * @constructor
 */
export async function Online(accounts, device = EnumDevice.Mobile) {
  device = parseInt(device || "0");
  //TODO 小米接口暂时不支持token，后续会支持，暂时使用固定的secret来调用
  const resource = ("0000" + String(device)).substr(-4);
  const timestamp = Date.now();
  accounts = String(accounts);
  const online = [], offline = [];
  accounts.split(",").forEach(account => {
    const item = OnlineSet[account];
    if (item && item.timestamp + 60000 > timestamp && (device === 0 && item.onlineResources.length || item.onlineResources.includes(resource))) {
      online.push(account);
    }
    else {
      offline.push(account);
    }
  });
  if (offline.length) {
    const url = `https://mimc.chat.xiaomi.net/api/account/status`;
    try {
      const token = MIMCClient.user.getToken();
      const result = await PostAsync(url, {
        appId: MIMCClient.appId,
        accounts: offline.join(),
      }, {token});
      offline.length = 0;
      result.data.forEach(item => {
        OnlineSet[item.account] = {
          onlineResources: item.onlineResources.filter(resource => resource).map(resource => resource.substr(0, 4)),
          timestamp
        };
        if (device === 0 && OnlineSet[item.account].onlineResources.length || OnlineSet[item.account].onlineResources.includes(resource)) {
          online.push(item.account);
        }
        else {
          offline.push(item.account);
        }
      });
    }
    catch (e) {
      console.error("online:", e);
    }
  }
  return {online, offline};
}