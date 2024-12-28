import { ApiMethods } from "../ApiMethods";
import COLOR_ENDPOINTS from "../endpoints/colorEndpoint";

export const getColors = (colorID = "") => {
    return ApiMethods.get(COLOR_ENDPOINTS.COLOR(colorID))
}

export const addColor = (colorID = "",name = "", colorCode = "", ) => {
    const body = {
        id: colorID,
        name, 
        colorCode
    };

    return ApiMethods.post(COLOR_ENDPOINTS.ADMIN_COLOR(), body)
}

export const deleteColor = (colorID = "") => {
    return ApiMethods.delete(COLOR_ENDPOINTS.ADMIN_COLOR(colorID))
}