let token = null;

export const setSessionToken = (nextToken) => { token = nextToken; };
export const clearSessionToken = () => { token = null; };
export const authHeaders = () => token ? { Authorization: `Bearer ${token}` } : {};
