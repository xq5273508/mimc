import {GetAsync, GetSync, PostAsync, PostSync, DeleteAsync, DeleteSync} from "./libs/ajax";
import {EnumDevice, EnumStatus, EnumGroupNotice,EnumEvent} from "./mimc/enum";
import {Register} from "./mimc/register";
import {MIMCService} from "./mimc/service";
import {GroupService} from "./mimc/group";
import {Guid, ToPromise} from "./libs/utils";

export const MIMC = {
  Service: MIMCService,
  Register,
  Group: GroupService,
  Enum: {
    EnumStatus,
    EnumDevice,
    EnumGroupNotice,
    EnumEvent
  },
  Ajax: {
    GetSync,
    GetAsync,
    PostSync,
    PostAsync,
    DeleteSync,
    DeleteAsync,
  },
  Utils: {Guid, ToPromise}
};