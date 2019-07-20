import {EnumDevice, EnumStatus} from "./enum";
import {Events} from "./register";

export const MIMCClient = {
  user: null,
  state: EnumStatus.None,
  timestamp: 0,
  appId: "",
  appAccount: "",
  device: EnumDevice.Mobile,
  resource: ""
};

export function StateChange(_state, ...args) {
  MIMCClient.status = _state;
  Events.onStateChange(_state, ...args);
}