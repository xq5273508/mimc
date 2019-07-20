import {GetAsync, GetSync, PostAsync, PostSync, DeleteAsync, DeleteSync} from "./libs/ajax";
import {EnumDevice, EnumStatus, EnumGroupNotice} from "./mimc/enum";
import {Register} from "./mimc/register";
import {MIMCService} from "./mimc/service";
import {GroupService} from "./mimc/group";

export const MIMC = {
  Service: MIMCService,
  Register,
  Group: GroupService,
  Enum: {
    EnumStatus,
    EnumDevice,
    EnumGroupNotice,
  },
  Ajax: {
    GetSync,
    GetAsync,
    PostSync,
    PostAsync,
    DeleteSync,
    DeleteAsync,
  },
};