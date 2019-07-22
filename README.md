# 基于MIMC（小米消息云）封装的Web消息开发包
## SDK组成
1、Enum:枚举项</br>
        EnumStatus、EnumDevice、EnumGroupNotice</br>
2、Register: 消息事件注册,提供接收消息（人、群）、登录Token、群消息、登录状态改变</br>
3、Service: 消息服务，提供配置初始化、登录、退出登录、发消息</br>
4、Group: 群操作，提供获取用户所有群列表、获取某个群详情、建群、解散群、踢人、退群、邀请入群</br>
5、Ajax:提供同步、异步多种Method的Web请求</br>
        GetSync、GetAsync、PostSync、PostAsync、DeleteSync、DeleteAsync</br>
## 一、枚举项
1、EnumStatus        用户状态枚举</br>
	Connecting: -1,	    //登录中</br>
	None: 0,		    //未登录</br>
	Connected: 1,		//登录成功</br>
	Elsewhere: 2,		//别处登录</br>
	DisConnect: 3,		//断开连接</br>
2、EnumDevice        登录设备枚举（系统会进行同一设备不允许多端登录的控制）</br>
	Mobile: 1,		    //手机端</br>
	PC: 2,			    //电脑端</br>
	Server: 4		    //系统服务</br>
3、EnumGroupNotice   群通知类型</br>
	Dismiss: 2,         //解散群</br>
	ApplyJoinReply: 11, //加群申请回复</br>
	InviteJoin: 12,     //邀请入群</br>
	InviteJoinReply: 13,//邀请入群回复</br>
	Join: 14,           //有成员加入</br>
	MemberRemove: 21,   //踢成员出群</br>
	MemberQuit: 22,     //退群</br>
	SetRole: 30,        //设置角色</br>
	AddRole: 31,        //增加角色</br>
	RemoveRole: 32,     //去除角色</br>
	ApplyJoin: 40       //申请入群</br>
## 二、Register
1、fetchToken</br>
外部注册请求Token的方法，只支持同步获取</br>
事件参数：</br>
空</br>
调用方式：</br>
MIMC.Register("FetchToken", ()=>{</br>
  //1、调用认证代理服务TokenProxyServer，由认证代理调用小米Token服务</br>
  //sync.get("//api.maidiyun.com/im/mitoken/account");</br>
  //2、直接调用小米Token服务</br>
  const data = {appId, appKey, appSecret, appAccount};</br>
  return MIMC.PostSync("https://mimc.chat.xiaomi.net/api/account/token", data);</br>
});</br>
2、stateChange</br>
用户在线状态事件注册</br>
事件参数：</br>
 @param status {EnumStatus}</br>
调用方式：</br>
MIMC.Register("stateChange", (status) => {</br>
  console.log("stateChange", status);</br>
});</br>
3、receiveMessage</br>
接收消息（用户、群消息）</br>
事件参数：</br>
@param message {Object:{id, time, sender, content, group_id}}</br>
    id:消息客户端id（作用类似于上一版的domain）</br>
    time:消息发送时间戳</br>
    sender:消息发送人</br>
    content:消息内容</br>
    group_id:消息所属群id（接收用户消息的时候该属性为undefined,只有群消息才返回群号）</br>
调用方式:</br>
MIMC.Register("ReceiveMessage", (message) => {</br>
  console.log("receiveMessage", message);</br>
});</br>
4、groupNotice</br>
群通知注册，由于小米不支持群通知，所以使用指令来模拟群消息（<m_mimc,4）</br>
事件参数：</br>
@param type {EnumGroupNotice}</br>
@param notice {Object}</br>
调用方式:</br>
MIMC.Register("groupNotice", (type,notice) => {</br>
  console.log("groupNotice",type,notice);</br>
});</br>
7、sync（需要完善）</br>
用于进行多端状态同步的事件</br>
事件参数：</br>
暂空缺</br>
调用方式:</br>
暂空缺</br>
## 三、Service</br>
1、config(appId, appAccount, device = EnumDevice.Mobile)</br>
小米消息云数据初始化，初次登录或者切换用户时调用
@param appId       {string}      小米消息云appId
@param appAccount  {string}      要登录小米消息云的用户账号
@param version     {number}      消息版本，用来处理接收消息时判断是否进行消息格式转换
@param device      {EnumDevice}  当前登录的设备类型，用来处理账号在同一类设备只能登录一次，小米消息云中的resource前4位为device信息

2、async login()
登录小米消息云

3、logout()
退出小米消息云登录

4、send(toAccount, message, packetId = "", isGroup = false)
消息发送,给群发消息的时候toAccount为群编号，is_group设置为true
@param toAccount     {string}    消息接收人编号（可以是群号）
@param message       {string}    消息内容
@param packetId      {string}    消息客户端ID
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
