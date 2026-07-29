import axios from 'axios';
import {
  ProteinMetadata,
  LigandMetadata,
  DockingJobRequest,
  DockingJobResponse,
  AIActiveSiteResponse,
  AIInsightReport
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create Axios instance with 60s timeout to allow for Render free-tier cold starts
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // Health Check / Cold Start Ping
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get('/health', { timeout: 10000 });
      return response.data?.status === 'ok';
    } catch {
      return false;
    }
  },

  // Protein Services
  fetchProtein: async (pdbId: string): Promise<ProteinMetadata> => {
    const response = await axiosInstance.post('/protein/fetch', { pdb_id: pdbId });
    return response.data;
  },

  // Ligand Services
  prepareLigand: async (smiles: string, name: string): Promise<LigandMetadata> => {
    const response = await axiosInstance.post('/ligand/prepare', { smiles, name });
    return response.data;
  },

  // Docking Services
  runDocking: async (request: DockingJobRequest): Promise<DockingJobResponse> => {
    const response = await axiosInstance.post('/docking/run', request);
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<DockingJobResponse> => {
    const response = await axiosInstance.get(`/docking/status/${jobId}`);
    return response.data;
  },

  // AI Services
  getAIActiveSite: async (pdbId: string): Promise<AIActiveSiteResponse> => {
    const response = await axiosInstance.post('/ai/active-site', { pdb_id: pdbId });
    return response.data;
  },

  getAIInsightReport: async (jobId: string): Promise<AIInsightReport> => {
    const response = await axiosInstance.post('/ai/analyze-docking', { job_id: jobId });
    return response.data;
  }
};
