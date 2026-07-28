export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ProteinMetadata {
  id?: string;
  pdb_id: string;
  title: string;
  center: Vector3D;
  dimensions: Vector3D;
  pdb_file_url?: string;
  pdb_content?: string;
}

export interface LigandMetadata {
  smiles: string;
  name: string;
  num_atoms: number;
  formula: string;
  pdbqt_content?: string;
}

export interface GridBoxConfig {
  center: Vector3D;
  size: Vector3D;
}

export interface DockingPose {
  mode: number;
  affinity_score: number; // kcal/mol
  rmsd_lb: number;
  rmsd_ub: number;
  pdbqt_content: string;
}

export interface DockingJobRequest {
  pdb_id: string;
  ligand_smiles: string;
  ligand_name?: string;
  grid_center: Vector3D;
  grid_size: Vector3D;
  exhaustiveness?: number;
}

export interface DockingJobResponse {
  job_id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  top_affinity_score?: number;
  poses?: DockingPose[];
  error_message?: string;
  created_at: string;
}

export interface AIActiveSiteResponse {
  recommended_grid_center: Vector3D;
  recommended_grid_size: Vector3D;
  reasoning: string;
  key_residues: string[];
}

export interface AIInsightReport {
  summary: string;
  binding_affinity_evaluation: string;
  key_interactions: string[];
  validity_rating: 'High' | 'Moderate' | 'Low';
  suggested_modifications: string[];
}
