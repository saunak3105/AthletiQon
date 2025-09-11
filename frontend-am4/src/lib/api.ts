const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Pose detection endpoints
  async analyzePose(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.request('/pose/analyze', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async startPushupSession(options?: any) {
    return this.request('/pose/session/start', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: `session_${Date.now()}`,
        options: options || {}
      }),
    });
  }

  async endPushupSession(sessionId: string) {
    return this.request('/pose/session/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async getSessionStatus(sessionId: string) {
    return this.request(`/pose/session/${sessionId}`);
  }

  // Fitness endpoints
  async getTestTypes() {
    return this.request('/fitness/test-types');
  }

  async saveTestResults(results: any) {
    return this.request('/fitness/results', {
      method: 'POST',
      body: JSON.stringify(results),
    });
  }

  async getUserHistory(userId: string) {
    return this.request(`/fitness/history/${userId}`);
  }

  async getLeaderboard(testType: string) {
    return this.request(`/fitness/leaderboard/${testType}`);
  }
}

export const apiClient = new ApiClient();