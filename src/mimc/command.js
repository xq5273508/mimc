import {MIMCClient} from "./client";
import {EnumCommand, EnumStatus} from "./enum";
import {Events} from "./register";


/**
 * 构造系统指令
 * @param command
 * @param props
 * @returns {string}
 * @constructor
 */
export function SystemCommand(command, props) {
  const options = {user: MIMCClient.user.getAppAccount(), timestamp: Date.now()};
  props && (options.props = props);
  return `<system_command,${command},${JSON.stringify(options)}>`;
}

/**
 * 解析系统指令
 * @param command
 * @param options
 * @constructor
 */
export function TransSystemCommand(command, options) {
  const {user, timestamp, props} = JSON.parse(options);
  switch (command) {
    case EnumCommand.Online:
      //上线之后收到的踢人指令
      const device = props.resource.substr(0, 4);
      if (timestamp < MIMCClient.timestamp || parseInt(device) !== MIMCClient.device || props.resource === MIMCClient.resource) {
        return;
      }
      MIMCClient.state = EnumStatus.Elsewhere;
      Events.onStateChange(EnumStatus.Elsewhere);
      MIMCClient.user && MIMCClient.user.logout();
      break;
    case EnumCommand.GroupNotice:
      const notice = Object.assign(props, {user, timestamp});
      Events.onGroupNotice(notice);
      break;
    case EnumCommand.Offline:
      break;
  }
}