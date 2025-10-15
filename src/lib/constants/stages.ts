export const STAGE_WORKFLOW: Record<string, string> = {
  'front_desk': 'nurse',
  'nurse': 'doctor',
  'doctor': 'lab',
  'lab': 'pharmacy',
  'pharmacy': 'billing',
  'billing': 'returned_to_front_desk'
};

export const STAGE_LABELS: Record<string, string> = {
  'front_desk': 'Front Desk',
  'nurse': 'Nurse',
  'doctor': 'Doctor',
  'lab': 'Laboratory',
  'pharmacy': 'Pharmacy',
  'billing': 'Billing',
  'returned_to_front_desk': 'Returned to Front Desk',
  'completed': 'Completed'
};

export const STAGE_BADGE_COLORS: Record<string, string> = {
  'front_desk': 'badge-soft-secondary',
  'nurse': 'badge-soft-info',
  'doctor': 'badge-soft-primary',
  'lab': 'badge-soft-warning',
  'pharmacy': 'badge-soft-purple',
  'billing': 'badge-soft-danger',
  'returned_to_front_desk': 'badge-soft-secondary',
  'completed': 'badge-soft-success'
};

export const STAGE_PERMISSIONS: Record<string, string[]> = {
  'nurse': ['NURSE', 'ADMIN'],
  'doctor': ['DOCTOR', 'ADMIN'],
  'lab': ['LAB', 'ADMIN'],
  'pharmacy': ['PHARMACY', 'ADMIN'],
  'billing': ['BILLING', 'ADMIN']
};

export const ROLE_TO_STAGE: Record<string, string> = {
  'FRONT_DESK': 'front_desk',
  'NURSE': 'nurse',
  'DOCTOR': 'doctor',
  'LAB': 'lab',
  'PHARMACY': 'pharmacy',
  'BILLING': 'billing'
};

export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  'front_desk': ['nurse', 'doctor', 'lab', 'pharmacy', 'billing', 'completed'],
  'nurse': ['returned_to_front_desk', 'completed'],
  'doctor': ['nurse', 'lab', 'pharmacy', 'billing', 'completed'],
  'lab': ['doctor', 'pharmacy', 'billing', 'completed'],
  'pharmacy': ['billing', 'completed'],
  'billing': ['returned_to_front_desk', 'completed'],
  'returned_to_front_desk': ['doctor', 'nurse', 'lab', 'pharmacy', 'billing', 'completed']
};

export function getNextStage(currentStage: string): string | null {
  return STAGE_WORKFLOW[currentStage] || null;
}

export function getAllowedTransitions(currentStage: string): string[] {
  return ALLOWED_TRANSITIONS[currentStage] || [];
}

export function getStageLabel(stage: string): string {
  return STAGE_LABELS[stage] || stage;
}

export function getStageBadgeClass(stage: string): string {
  return STAGE_BADGE_COLORS[stage] || 'badge-soft-secondary';
}

export function canAccessStage(userRole: string, stage: string): boolean {
  const allowedRoles = STAGE_PERMISSIONS[stage];
  if (!allowedRoles) return userRole === 'ADMIN';
  return allowedRoles.includes(userRole);
}
