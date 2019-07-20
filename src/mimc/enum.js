// ["", "未登录", "重新登录中", "登录成功", "被踢下线", "断开连接"]

export const EnumStatus = {
  Connecting: -1,           //登录中
  None: 0,                  //未登录
  Connected: 1,             //登录成功
  Elsewhere: 2,             //别处登录
  DisConnect: 3,            //断开连接
};

export const EnumDevice = {
  Mobile: 1,
  PC: 2,
  Server: 4
};

export const EnumCommand = {
  Online: 1,                //上线
  Offline: 2,               //下线
  GroupNotice: 4,           //群消息
  Async: 8                  //多端数据同步
};

export const EnumEvent = {
  ReceiveMessage: "ReceiveMessage",
  FetchToken: "FetchToken",
  StateChange: "StateChange",
  GroupNotice: "GroupNotice",
  Sync: "Sync"
};

export const EnumGroupNotice = {
  Dismiss: 2,               //解散群
  ApplyJoinReply: 11,       //加群申请回复
  InviteJoin: 12,           //邀请入群
  InviteJoinReply: 13,      //邀请入群回复
  Join: 14,                 //有成员加入
  MemberRemove: 21,         //踢成员出群
  MemberQuit: 22,           //退群
  ApplyJoin: 40             //申请入群
};