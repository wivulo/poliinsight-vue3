import axios from "axios";
import { databaseURL } from "@/config";

const source = databaseURL + '/settings';

export default {
    index() {
        return axios.get(source);
    },

    show(id) {
        return axios.get(`${source}/${id}`);
    },

    store(data) {
        return axios.post(source, { settingData: data });
    },

    update(data) {
        return axios.put(source, { settingData: data });
    },

    delete(id) {
        return axios.delete(`${source}/${id}`);
    },

    showGroups() {
        return axios.get(`${source}/groups`);
    },

    showGroup(id) {
        return axios.get(`${source}/groups/${id}`);
    },

    showGroupsBySettingId(settingId) {
        return axios.get(`${source}/groups/${settingId}`);
    },

    ShowGroupsBySettingCode(code: string) {
        return axios.get(`${source}/groups/settingcode/${code}`);
    },

    createGroup(data) {
        return axios.post(`${source}/groups`, { groupData: data });
    },

    updateGroup(data) {
        return axios.put(`${source}/groups`, { groupData: data });
    },

    deleteGroup(id) {
        return axios.delete(`${source}/groups/${id}`);
    },

    showGroupItemsByGroupId(groupId: number) {
        return axios.get(`${source}/groupItems/${groupId}`);
    },

    showSettingGroupItemByKey(key: string) {
        return axios.get(`${source}/groupItems/key/${key}`);
    },

    createGroupItem(data) {
        return axios.post(`${source}/groupItems`, { groupItemData: data });
    },

    updateGroupItem(data: any) {
        return axios.put(`${source}/groupItems`, { groupItemData: data });
    }
};
