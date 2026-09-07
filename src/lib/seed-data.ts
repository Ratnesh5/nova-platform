import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function runDatabaseSeed() {
  // Clear existing data in correct relational order
  await prisma.activityLog.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await hashPassword('password123');

  // Create Users
  const userAlex = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@nova.io',
      passwordHash,
      role: 'ADMIN',
      title: 'Head of Product & Eng',
      department: 'Leadership',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const userSarah = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah@nova.io',
      passwordHash,
      role: 'MEMBER',
      title: 'Staff Frontend Engineer',
      department: 'Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  });

  const userMarcus = await prisma.user.create({
    data: {
      name: 'Marcus Johnson',
      email: 'marcus@nova.io',
      passwordHash,
      role: 'MEMBER',
      title: 'Principal Backend Architect',
      department: 'Infrastructure',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const userElena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@nova.io',
      passwordHash,
      role: 'MEMBER',
      title: 'Lead Product Designer',
      department: 'Design',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const userDavid = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'david@nova.io',
      passwordHash,
      role: 'MEMBER',
      title: 'QA & Security Engineer',
      department: 'Security',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Project 1: Nova Cloud 2.0 Platform
  const project1 = await prisma.project.create({
    data: {
      title: 'NOVA Cloud Engine 2.0',
      key: 'NOVA',
      description: 'Next-generation distributed microservices runtime and collaborative team workspace API.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      category: 'Engineering',
      budget: 125000,
      color: '#6366f1',
      ownerId: userAlex.id,
      startDate: new Date(Date.now() - 25 * 86400000),
      dueDate: new Date(Date.now() + 35 * 86400000),
    },
  });

  // Project 2: Mobile App iOS & Android
  const project2 = await prisma.project.create({
    data: {
      title: 'Nova Mobile Companion',
      key: 'MOB',
      description: 'Cross-platform React Native app for offline task tracking, quick approvals, and push alerts.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      category: 'Product',
      budget: 85000,
      color: '#06b6d4',
      ownerId: userSarah.id,
      startDate: new Date(Date.now() - 14 * 86400000),
      dueDate: new Date(Date.now() + 45 * 86400000),
    },
  });

  // Project 3: Design System & Branding Kit
  const project3 = await prisma.project.create({
    data: {
      title: 'Design System & Component Library',
      key: 'DSN',
      description: 'Standardized UI tokens, accessible Figma components, dark mode aesthetics, and WCAG AAA compliance.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      category: 'Design',
      budget: 45000,
      color: '#ec4899',
      ownerId: userElena.id,
      startDate: new Date(Date.now() - 30 * 86400000),
      dueDate: new Date(Date.now() + 20 * 86400000),
    },
  });

  // Project 4: SOC2 Type II Security Certification
  const project4 = await prisma.project.create({
    data: {
      title: 'SOC2 Type II & Penetration Audit',
      key: 'SEC',
      description: 'Zero-trust network architecture, automated audit trails, data encryption at rest and in transit.',
      status: 'PLANNING',
      priority: 'HIGH',
      category: 'Operations',
      budget: 60000,
      color: '#10b981',
      ownerId: userDavid.id,
      startDate: new Date(Date.now() - 5 * 86400000),
      dueDate: new Date(Date.now() + 60 * 86400000),
    },
  });

  // Project Members
  const allUsers = [userAlex, userSarah, userMarcus, userElena, userDavid];
  for (const proj of [project1, project2, project3, project4]) {
    for (const u of allUsers) {
      await prisma.projectMember.create({
        data: {
          projectId: proj.id,
          userId: u.id,
          role: u.id === proj.ownerId ? 'OWNER' : u.id === userAlex.id ? 'LEAD' : 'CONTRIBUTOR',
        },
      });
    }
  }

  // Tasks for Project 1 (NOVA)
  const task1 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Architect Real-time WebSocket Gateway',
      description: 'Implement bi-directional event syncing for multi-cursor and instant task status broadcast.',
      status: 'DONE',
      priority: 'URGENT',
      order: 0,
      estimatedHours: 40,
      actualHours: 36,
      dueDate: new Date(Date.now() - 2 * 86400000),
      createdById: userAlex.id,
      assigneeId: userMarcus.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Build Interactive Kanban Drag-and-Drop Board',
      description: 'Smooth glassmorphism card drag, column state persistence, optimistic UI updates, and keyboard support.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      order: 1,
      estimatedHours: 32,
      actualHours: 20,
      dueDate: new Date(Date.now() + 4 * 86400000),
      createdById: userAlex.id,
      assigneeId: userSarah.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Implement JWT Session & Role-Based Access Control',
      description: 'Secure token authentication, middleware verification, and permissions matrix for Admin/Member/Viewer.',
      status: 'DONE',
      priority: 'HIGH',
      order: 2,
      estimatedHours: 24,
      actualHours: 22,
      dueDate: new Date(Date.now() - 5 * 86400000),
      createdById: userAlex.id,
      assigneeId: userMarcus.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Performance Optimization & LCP Profiling',
      description: 'Audit bundle size, tree-shake chart packages, lazy load modal dialogs, and achieve 98+ Lighthouse score.',
      status: 'IN_REVIEW',
      priority: 'MEDIUM',
      order: 3,
      estimatedHours: 16,
      actualHours: 14,
      dueDate: new Date(Date.now() + 6 * 86400000),
      createdById: userSarah.id,
      assigneeId: userSarah.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Automated CSV & PDF Summary Export',
      description: 'Generate formatted executive progress summaries with velocity metrics and timeline breakdowns.',
      status: 'TODO',
      priority: 'LOW',
      order: 4,
      estimatedHours: 12,
      actualHours: 0,
      dueDate: new Date(Date.now() + 15 * 86400000),
      createdById: userAlex.id,
      assigneeId: userElena.id,
    },
  });

  // Tasks for Project 2 (Mobile)
  await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Offline SQLite Cache & Delta Sync',
      description: 'Allow users to edit tasks offline and auto-resolve sync conflicts upon reconnecting.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      order: 0,
      estimatedHours: 35,
      actualHours: 18,
      dueDate: new Date(Date.now() + 8 * 86400000),
      createdById: userSarah.id,
      assigneeId: userMarcus.id,
    },
  });

  await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Push Notification Dispatcher',
      description: 'APNS and FCM integration for instant task assignment and comment mentions.',
      status: 'TODO',
      priority: 'HIGH',
      order: 1,
      estimatedHours: 20,
      actualHours: 0,
      dueDate: new Date(Date.now() + 18 * 86400000),
      createdById: userSarah.id,
      assigneeId: userSarah.id,
    },
  });

  // Subtasks for task2
  await prisma.subtask.createMany({
    data: [
      { taskId: task2.id, title: 'Build column drop container layout', completed: true, order: 0 },
      { taskId: task2.id, title: 'Add fluid micro-interactions and hover glow', completed: true, order: 1 },
      { taskId: task2.id, title: 'Integrate optimistic column state transitions', completed: false, order: 2 },
      { taskId: task2.id, title: 'Add quick-add inline task shortcut', completed: false, order: 3 },
    ],
  });

  // Subtasks for task1
  await prisma.subtask.createMany({
    data: [
      { taskId: task1.id, title: 'Configure heartbeat ping/pong protocol', completed: true, order: 0 },
      { taskId: task1.id, title: 'Implement channel subscription router', completed: true, order: 1 },
      { taskId: task1.id, title: 'Stress test 10k concurrent connections', completed: true, order: 2 },
    ],
  });

  // Comments for task2
  await prisma.comment.createMany({
    data: [
      {
        taskId: task2.id,
        userId: userElena.id,
        content: 'I uploaded the revised Figma token variables for the column badges. Please use the violet-500 accents!',
      },
      {
        taskId: task2.id,
        userId: userSarah.id,
        content: 'Looks awesome Elena! Already hooked it up with Tailwind CSS v4 variables.',
      },
      {
        taskId: task2.id,
        userId: userAlex.id,
        content: 'Great progress team. Let us test with 50+ cards to make sure scrolling is buttery smooth.',
      },
    ],
  });

  // Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        projectId: project1.id,
        userId: userAlex.id,
        action: 'PROJECT_CREATED',
        details: 'Created project NOVA Cloud Engine 2.0',
        entityType: 'PROJECT',
        entityId: project1.id,
      },
      {
        projectId: project1.id,
        userId: userMarcus.id,
        action: 'TASK_COMPLETED',
        details: 'Completed task: Architect Real-time WebSocket Gateway',
        entityType: 'TASK',
        entityId: task1.id,
      },
      {
        projectId: project1.id,
        userId: userSarah.id,
        action: 'TASK_MOVED',
        details: 'Moved "Build Interactive Kanban Board" to In Progress',
        entityType: 'TASK',
        entityId: task2.id,
      },
      {
        projectId: project1.id,
        userId: userElena.id,
        action: 'COMMENT_ADDED',
        details: 'Added a design feedback comment on Kanban Board',
        entityType: 'COMMENT',
        entityId: task2.id,
      },
    ],
  });

  return {
    usersCount: 5,
    projectsCount: 4,
    tasksCount: 7,
  };
}
