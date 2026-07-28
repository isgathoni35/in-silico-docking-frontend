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

export const apiClient = {
  // Protein Services
  fetchProtein: async (pdbId: string): Promise<ProteinMetadata> => {
    const response = await axios.post(`${API_BASE_URL}/protein/fetch`, { pdb_id: pdbId });
    return response.data;
  },

  // Ligand Services
  prepareLigand: async (smiles: string, name: string): Promise<LigandMetadata> => {
    const response = await axios.post(`${API_BASE_URL}/ligand/prepare`, { smiles, name });
    return response.data;
  },

  // Docking Services
  runDocking: async (request: DockingJobRequest): Promise<DockingJobResponse> => {
    const response = await axios.post(`${API_BASE_URL}/docking/run`, request);
    return response.data;
  },

  getJobStatus: async (jobId: string): Promise<DockingJobResponse> => {
    const response = await axios.get(`${API_BASE_URL}/docking/status/${jobId}`);
    return response.data;
  },

  // AI Services
  getAIActiveSite: async (pdbId: string): Promise<AIActiveSiteResponse> => {
    const response = await axios.post(`${API_BASE_URL}/ai/active-site`, { pdb_id: pdbId });
    return response.data;
  },

  getAIInsightReport: async (jobId: string): Promise<AIInsightReport> => {
    const response = await axios.post(`${API_BASE_URL}/ai/analyze-docking`, { job_id: jobId });
    return response.data;
  }
};
