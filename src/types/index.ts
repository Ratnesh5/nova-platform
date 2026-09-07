export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'ON_HOLD';
export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER';
export type ProjectRole = 'OWNER' | 'LEAD' | 'CONTRIBUTOR' | 'VIEWER';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  title?: string | null;
  department?: string | null;
}

export interface SubtaskData {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
}

export interface CommentData {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: UserSummary;
}

export interface TaskData {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  order: number;
  estimatedHours?: number | null;
  actualHours?: number | null;
  dueDate?: string | null;
  createdById: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
    key: string;
    color?: string;
  };
  assignee?: UserSummary | null;
  creator?: UserSummary;
  subtasks?: SubtaskData[];
  comments?: CommentData[];
  _count?: {
    subtasks?: number;
    comments?: number;
  };
}

export interface ProjectMemberData {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: string;
  user: UserSummary;
}

export interface ActivityLogData {
  id: string;
  projectId?: string | null;
  userId: string;
  action: string;
  details: string;
  entityType?: string | null;
  entityId?: string | null;
  createdAt: string;
  user: UserSummary;
  project?: {
    id: string;
    title: string;
    key: string;
  } | null;
}

export interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  key: string;
  status: ProjectStatus;
  priority: Priority;
  category: string;
  budget?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  color: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: UserSummary;
  members?: ProjectMemberData[];
  tasks?: TaskData[];
  activities?: ActivityLogData[];
  _count?: {
    tasks?: number;
    members?: number;
  };
  taskMetrics?: {
    total: number;
    completed: number;
    inProgress: number;
    inReview: number;
    todo: number;
    completionPercentage: number;
  };
}
