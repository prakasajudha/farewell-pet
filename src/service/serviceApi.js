import API_INSTANCE from "./index";

export const getUserDetails = async (params) => {
    try {
        const response = await API_INSTANCE.get("/v1/user-details", { params });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const login = async (loginData) => {
    try {
        const response = await API_INSTANCE.post('/v1/user/login', loginData);
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await API_INSTANCE.put('/v1/user/change-password', passwordData);
        return response;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

export const getNonPrivateMessages = async () => {
    try {
        const response = await API_INSTANCE.get('/v1/message/not-private');
        return response;
    } catch (error) {
        console.error('Get non-private messages error:', error);
        throw error;
    }
};

export const getMyMessages = async () => {
    try {
        const response = await API_INSTANCE.get('/v1/message/my-messages');
        return response;
    } catch (error) {
        console.error('Get my messages error:', error);
        throw error;
    }
};

export const sendMessage = async (messageData) => {
    try {
        const response = await API_INSTANCE.post('/v1/message', messageData);
        return response;
    } catch (error) {
        console.error('Send message error:', error);
        throw error;
    }
};

export const getMessageStats = async () => {
    try {
        const response = await API_INSTANCE.get('/v1/message/stats');
        return response;
    } catch (error) {
        console.error('Get message stats error:', error);
        throw error;
    }
};

export const getConfiguration = async () => {
    try {
        const response = await API_INSTANCE.get('/v1/configuration');
        return response;
    } catch (error) {
        console.error('Get configuration error:', error);
        throw error;
    }
};

export const updateConfiguration = async (configData) => {
    try {
        const response = await API_INSTANCE.put('/v1/configuration/update', configData);
        return response;
    } catch (error) {
        console.error('Update configuration error:', error);
        throw error;
    }
};

export const getLeaderboard = async () => {
    try {
        const response = await API_INSTANCE.get('/v1/leaderboard');
        return response;
    } catch (error) {
        console.error('Get leaderboard error:', error);
        throw error;
    }
};
