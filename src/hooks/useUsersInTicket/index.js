import api from "../../services/api";

const useUsersInTicket = () => {
    const listUsers = async (params) => {
        const { data } = await api.request({
            url: '/usersInTicket/',
            method: 'GET',
            params
        });
        return data;
    }

    return {
        listUsers
    }
}

export default useUsersInTicket;