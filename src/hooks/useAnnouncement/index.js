import api from "../../services/api";

const useAnnouncement = () => {

    const addAnnouncement = async (data) => {
        const { data: responseData } = await api.request({
            url: '/announcements',
            method: 'POST',
            data
        });
        return responseData;
    }


    return {
        addAnnouncement
    }
}

export default useAnnouncement;