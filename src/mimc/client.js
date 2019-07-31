import {EnumDevice, EnumStatus} from "./enum";

export const MIMCClient = {
  user: null,
  state: EnumStatus.None,
  timestamp: 0,
  appId: "",
  appAccount: "",
  device: EnumDevice.Mobile,
  resource: ""
};