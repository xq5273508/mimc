# 基于MIMC（小米消息云）封装的Web消息开发包<br/>
## SDK组成<br/>
1、Enum:枚举项<br/>
&emsp;&emsp;EnumStatus、EnumDevice、EnumGroupNotice<br/><br/>
2、Register: 消息事件注册,提供接收消息（人、群）、登录Token、群消息、登录状态改变<br/><br/>
3、Service: 消息服务<br/>
&emsp;&emsp;提供配置初始化、登录、退出登录、发消息<br/><br/>
4、Group: 群操作<br/>
&emsp;&emsp;提供获取用户所有群列表、获取某个群详情、建群、解散群、踢人、退群、邀请入群<br/><br/>
5、Ajax:提供同步、异步多种Method的Web请求<br/>
&emsp;&emsp;GetSync、GetAsync、PostSync、PostAsync、DeleteSync、DeleteAsync<br/>
## 一、枚举项<br/>
1、EnumStatus        用户状态枚举<br/>
&emsp;&emsp;Connecting: -1,	    //登录中<br/>
&emsp;&emsp;None: 0,		    //未登录<br/>
&emsp;&emsp;Connected: 1,		//登录成功<br/>
&emsp;&emsp;Elsewhere: 2,		//别处登录<br/>
&emsp;&emsp;DisConnect: 3,		//断开连接<br/><br/>
2、EnumDevice        登录设备枚举（系统会进行同一设备不允许多端登录的控制）<br/>
&emsp;&emsp;Mobile: 1,		    //手机端<br/>
&emsp;&emsp;PC: 2,			    //电脑端<br/>
&emsp;&emsp;Server: 4		    //系统服务<br/><br/>
3、EnumGroupNotice   群通知类型<br/>
&emsp;&emsp;Dismiss: 2,         //解散群<br/>
&emsp;&emsp;ApplyJoinReply: 11, //加群申请回复<br/>
&emsp;&emsp;InviteJoin: 12,     //邀请入群<br/>
&emsp;&emsp;InviteJoinReply: 13,//邀请入群回复<br/>
&emsp;&emsp;Join: 14,           //有成员加入<br/>
&emsp;&emsp;MemberRemove: 21,   //踢成员出群<br/>
&emsp;&emsp;MemberQuit: 22,     //退群<br/>
&emsp;&emsp;SetRole: 30,        //设置角色<br/>
&emsp;&emsp;AddRole: 31,        //增加角色<br/>
&emsp;&emsp;RemoveRole: 32,     //去除角色<br/>
&emsp;&emsp;ApplyJoin: 40       //申请入群<br/>
## 二、Register<br/>
1、fetchToken<br/>
外部注册请求Token的方法，只支持同步获取<br/>
事件参数：<br/>
空<br/>
调用方式：<br/>
MIMC.Register("FetchToken", ()=>{<br/>
&emsp;&emsp;//1、调用认证代理服务TokenProxyServer，由认证代理调用小米Token服务<br/>
&emsp;&emsp;//sync.get("//api.maidiyun.com/im/mitoken/account");<br/>
&emsp;&emsp;//2、直接调用小米Token服务<br/>
&emsp;&emsp;const data = {appId, appKey, appSecret, appAccount};<br/>
&emsp;&emsp;MIMC.PostSync("https://mimc.chat.xiaomi.net/api/account/token", data);<br/>
});<br/><br/>
2、stateChange<br/>
用户在线状态事件注册<br/>
事件参数：<br/>
@param status {EnumStatus}<br/>
调用方式：<br/>
MIMC.Register("StateChange", (status) => {<br/>
&emsp;&emsp;console.log("stateChange", status);<br/>
});<br/><br/>
3、receiveMessage<br/>
接收消息（用户、群消息）<br/>
事件参数：<br/>
@param message {Object:{id, timestamp, sender, content, group_id}}<br/>
&emsp;&emsp;id:消息客户端id（作用类似于上一版的domain）<br/>
&emsp;&emsp;timestamp:消息发送时间戳<br/>
&emsp;&emsp;sender:消息发送人<br/>
&emsp;&emsp;content:消息内容<br/>
&emsp;&emsp;group_id:消息所属群id（接收用户消息的时候该属性为undefined,只有群消息才返回群号）<br/>
调用方式:<br/>
MIMC.Register("ReceiveMessage", (message) => {<br/>
&emsp;&emsp;console.log("receiveMessage", message);<br/>
});<br/><br/>
4、groupNotice<br/>
群通知注册，由于小米不支持群通知，所以使用指令来模拟群消息（<m_mimc,4）<br/>
事件参数：<br/>
@param type {EnumGroupNotice}<br/>
@param notice {Object}<br/>
调用方式:<br/>
MIMC.Register("GroupNotice", (type,notice) => {<br/>
&emsp;&emsp;console.log("groupNotice",type,notice);<br/>
});<br/>
7、sync（需要完善）<br/>
用于进行多端状态同步的事件<br/>
事件参数：<br/>
暂空缺<br/>
调用方式:<br/>
暂空缺<br/>
## 三、Service<br/>
1、config(appId, appAccount, device = EnumDevice.Mobile)<br/>
小米消息云数据初始化，初次登录或者切换用户时调用<br/>
@param appId       {string}      小米消息云appId<br/>
@param appAccount  {string}      要登录小米消息云的用户账号<br/>
@param version     {number}      消息版本，用来处理接收消息时判断是否进行消息格式转换<br/>
@param device      {EnumDevice}  当前登录的设备类型，用来处理账号在同一类设备只能登录一次，小米消息云中的resource前4位为device信息<br/><br/>
2、async login()<br/>
登录小米消息云<br/><br/>
3、logout()<br/>
退出小米消息云登录<br/><br/>
4、send(toAccount, message, packetId = "", isGroup = false)<br/><br/>
消息发送,给群发消息的时候toAccount为群编号，is_group设置为true<br/>
@param toAccount     {string}    消息接收人编号（可以是群号）<br/>
@param message       {string}    消息内容<br/>
@param packetId      {string}    消息客户端ID<br/>
@param is_group      {boolean}   是否是给群组发消息<br/><br/>
5、online(accounts, device = EnumDevice.Mobile)<br/>
查询用户在线状态<br/>
@param accounts     {string}       要查询的用户<br/>
@param device       {EnumDevice}   要查询的设备<br/>
## 四、Group<br/>
1、async list()<br/>
获取加入的群列表<br/><br/>
2、async info(id)<br/>
获取群详情<br/>
@param id    {string}  群号<br/><br/>
3、async create(name, members)<br/>
创建群<br/>
@param name      {string}   群名称<br/>
@param members   {string}   群成员id列表（,分割id）<br/><br/>
4、async invite(id, members)<br/>
邀请成员加入群，不需要被邀请人同意，直接加入群<br/>
@param id        {string}  群编号<br/>
@param members   {string}  群成员id列表（,连接）<br/><br/>
5、async apply(id, owner,remark)<br/>
申请入群<br/>
@param id      {string}  群号<br/>
@param owner   {string}  群主<br/>
@param remark  {string}  申请备注<br/><br/>
6、async reply(id, member, agree = true)<br/>
申请入群回复<br/>
@param id      {string}  群号<br/>
@param member  {string}  申请人<br/>
@param agree   {boolean} 同意<br/><br/>
7、async remove(id, members,token)<br/>
删除群成员<br/>
@param id      {string}    群号<br/>
@param members {string}    要踢的群成员id列表（,连接）<br/>
@param token   {string}    群主token（支持业务自己判断是否是管理员，如果是管理员，则允许使用群主的身份踢人）<br/><br/>
8、async quit(id)<br/>
退群操作<br/>
@param id      {string}    群号<br/><br/>
9、async set_admin(id,member)<br/>
设置群管理员<br/>
@param id      {string}    群号<br/>
@param member  {string}    成员编号<br/><br/>
10、async cancel_admin(id,member)<br/>
取消群管理员<br/>
@param id      {string}    群号<br/>
@param member  {string}    成员编号<br/><br/>
11、async dismiss(id)<br/>
根据群号解散群<br/>
@param id      {string}    群号<br/><br/>
## 五、数据请求<br/>
1、GetSync(url, data, headers)<br/>
同步方式调用GET<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/><br/>
2、GetAsync(url, data, headers)<br/>
异步方式调用GET，返回Promise<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/><br/>
3、PostSync(url, data, headers)<br/>
同步方式调用POST<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/><br/>
4、PostAsync(url, data, headers)<br/>
异步方式调用POST，返回Promise<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/><br/>
5、DeleteSync(url, data, headers)<br/>
同步方式调用DELETE<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/>
6、DeleteAsync(url, data, headers)<br/><br/>
异步方式调用DELETE，返回Promise<br/>
@param url       {string}    数据请求地址<br/>
@param data      {Object}    请求的数据<br/>
@param headers   {Object}    请求携带的Header信息<br/>
