import apiCall from "../utils/api";
import {Location} from "../models/Location";
import { Room } from "../models/Room";

export const roomLocationService = {
    getAllLocations: async () => {
        const respone = await apiCall('/locations', {
            method: 'GET',
        })
        return respone.data
    },

    getRoomsByLocationId: async (locationId) => {
        const respone = await apiCall(`/locations/${locationId}/rooms`, {
            method: 'GET',
        })
        return respone.data;
    },
    
    getTotalCapacityByLocationAndSubject: async (locationId, subjectId) => {
        const respone = await apiCall(`/locations/${locationId}/subject/${subjectId}/capacity`, {
            method: 'GET',
        })
        return respone.data;
    }
}