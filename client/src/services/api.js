const API_BASE = '/api';

class ApiClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL;
  }

  async request(method, url, data = null, options = {}) {
    const config = {
      method,
      headers: {
        ...options.headers
      },
      credentials: 'include'
    };

    if (data && !(data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      config.body = data;
    }

    const response = await fetch(`${this.baseURL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || error.errors?.[0]?.msg || 'Request failed');
    }

    return { data: await response.json() };
  }

  get(url, options) {
    return this.request('GET', url, null, options);
  }

  post(url, data, options) {
    return this.request('POST', url, data, options);
  }

  put(url, data, options) {
    return this.request('PUT', url, data, options);
  }

  delete(url, options) {
    return this.request('DELETE', url, null, options);
  }
}

const api = new ApiClient();

export default api;