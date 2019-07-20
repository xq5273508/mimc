# 基于MIMC（小米消息云）封装的Web消息开发包

## SDK组成
1、Enum:枚举项
        EnumStatus、EnumDevice、EnumGroupNotice
2、Register: 消息事件注册,提供接收消息（人、群）、登录Token、群消息、登录状态改变
3、Service: 消息服务，提供配置初始化、登录、退出登录、发消息
4、Group: 群操作，提供获取用户所有群列表、获取某个群详情、建群、解散群、踢人、退群、邀请入群,
5、Ajax:提供同步、异步多种Method的Web请求
        GetSync、GetAsync、PostSync、PostAsync、DeleteSync、DeleteAsync
6、Message:消息相关，提供消息转换的实现
        TranslateTo2018, TranslateTo2019

## 一、枚举项
1、EnumStatus        用户状态枚举
	Connecting: -1,	    //登录中
	None: 0,			//未登录
	Connected: 1,		//登录成功
	Elsewhere: 2,		//别处登录
	DisConnect: 3,		//断开连接
2、EnumDevice        登录设备枚举（系统会进行同一设备不允许多端登录的控制）
	Mobile: 1,		    //手机端
	PC: 2,			    //电脑端
	Server: 4			//系统服务
3、EnumGroupNotice   群通知类型
	Dismiss: 2,         //解散群
	ApplyJoinReply: 11, //加群申请回复
	InviteJoin: 12,     //邀请入群
	InviteJoinReply: 13,//邀请入群回复
	Join: 14,           //有成员加入
	MemberRemove: 21,   //踢成员出群
	MemberQuit: 22,     //退群
	SetRole: 30,        //设置角色
	AddRole: 31,        //增加角色
	RemoveRole: 32,     //去除角色
	ApplyJoin: 40       //申请入群

## 二、Register
1、fetchToken
外部注册请求Token的方法，只支持同步获取
事件参数：
空
调用方式：
MIMC.Register.fetchToken=()=>{
  //1、调用认证代理服务TokenProxyServer，由认证代理调用小米Token服务
  //sync.get(“//api.maidiyun.com/im/mitoken/account”);
  //2、直接调用小米Token服务
  const data = {appId, appKey, appSecret, appAccount};
  return MIMC.PostSync('https://mimc.chat.xiaomi.net/api/account/token', data);
}

2、statusChange
用户在线状态事件注册
事件参数：
 @param status {EnumStatus}
调用方式：
MIMC.Register.statusChange = (status) => {
  console.log("statusChange", status);
};

3、receiveMessage
接收消息（用户、群消息）
事件参数：
@param message {Object:{id, time, sender, content, group_id}}
    id:消息客户端id（作用类似于上一版的domain）
    time:消息发送时间戳
    sender:消息发送人
    content:消息内容
    group_id:消息所属群id（接收用户消息的时候该属性为undefined,只有群消息才返回群号）
调用方式:
MIMC.Register.receiveMessage = (message) => {
  console.log("receiveMessage", message);
};

4、groupNotice
群通知注册，由于小米不支持群通知，所以使用指令来模拟群消息（<m_mimc,4）
事件参数：
@param type {EnumGroupNotice}
@param notice {Object}
调用方式:
MIMC.Register.groupNotice = (type,notice) => {
  console.log("groupNotice",type,notice);
};

5、absolutePath2018
根据key获取万企联中文件绝对路径
事件参数：
@param path {string}
调用方式:
MIMC.Register.absolutePath2018 = (path) => {
  return "http://api50.maidiyun.com/api/v1/File/DownLoadPic?filePath=" + path;
};

6、absolutePath2019
根据key获取今日制造中文件绝对路径
事件参数：
@param path {string}
调用方式:
MIMC.Register.absolutePath2019 = (path) => {
  const key = path.replace(/^[^/]+\//, "");
  return "http://oss.maidiyun.cn/111/" + key;
};

7、sync（需要完善）
用于进行多端状态同步的事件
事件参数：
暂空缺
调用方式:
暂空缺

## 三、Service
1、config(appId, appAccount, device = EnumDevice.Mobile)
小米消息云数据初始化，初次登录或者切换用户时调用
@param appId       {string}      小米消息云appId
@param appAccount  {string}      要登录小米消息云的用户账号
@param version     {number}      消息版本，用来处理接收消息时判断是否进行消息格式转换
@param device      {EnumDevice}  当前登录的设备类型，用来处理账号在同一类设备只能登录一次，小米消息云中的resource前4位为device信息

2、async login()
登录小米消息云

3、logout()
退出小米消息云登录

4、send(toAccount, message, is_group = false)
消息发送,给群发消息的时候toAccount为群编号，is_group设置为true
@param toAccount     {string}    消息接收人编号（可以是群号）
@param message       {string}    消息内容
@param is_group      {boolean}   是否是给群组发消息

5、online(accounts, device = EnumDevice.Mobile)
查询用户在线状态
@param accounts     {string}       要查询的用户
@param device       {EnumDevice}   要查询的设备

## 四、Group
1、async list()
获取加入的群列表

2、async info(id)
获取群详情
@param id    {string}  群号

3、async create(name, members)
创建群
@param name      {string}   群名称
@param members   {string}   群成员id列表（,分割id）

4、async invite(id, members)
邀请成员加入群，不需要被邀请人同意，直接加入群
@param id        {string}  群编号
@param members   {string}  群成员id列表（,连接）

5、async apply(id, owner,remark)
申请入群
@param id      {string}  群号
@param owner   {string}  群主
@param remark  {string}  申请备注

6、async reply(id, member, agree = true)
申请入群回复
@param id      {string}  群号
@param member  {string}  申请人
@param agree   {boolean} 同意

7、async remove(id, members)
删除群成员
@param id      {string}    群号
@param members {string}    要踢的群成员id列表（,连接）

8、async quit(id)
退群操作
@param id      {string}    群号

9、async dismiss(id)
根据群号解散群
@param id      {string}    群号

## 五、数据请求
1、GetSync(url, data, headers)
同步方式调用GET
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

2、GetAsync(url, data, headers)
异步方式调用GET，返回Promise
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

3、PostSync(url, data, headers)
同步方式调用POST
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

4、PostAsync(url, data, headers)
异步方式调用POST，返回Promise
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

5、DeleteSync(url, data, headers)
同步方式调用DELETE
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

6、DeleteAsync(url, data, headers)
异步方式调用DELETE，返回Promise
@param url       {string}    数据请求地址
@param data      {Object}    请求的数据
@param headers   {Object}    请求携带的Header信息

## 六、消息处理
1、TranslateTo2018
消息转换为万企联消息格式
@param message   {string}  要转换的消息内容

2、TranslateTo2019
消息转换为今日制造消息格式
@param message   {string}  要转换的消息内容