import { create } from 'zustand';
import { Department, PerformanceRecord, Team } from '../types';
import { useAuthStore } from './mock-auth-store';

interface AppState {
  departments: Department[];
  teams: Team[];
  records: PerformanceRecord[];
  
  // Actions
  updateTeamFormula: (teamId: string, formula: Team['formula']) => void;
  createRecord: (record: PerformanceRecord) => void;
  updateRecord: (id: string, updates: Partial<PerformanceRecord>) => void;
}

const initialDepartments: Department[] = [
  { id: 'd1', name: 'Engineering' },
  { id: 'd2', name: 'Sales' },
];

const initialTeams: Team[] = [
  {
    id: 't1',
    name: 'Frontend',
    departmentId: 'd1',
    managerId: 'm1',
    reviewLevels: 1,
    formula: { attendanceWeight: 0.2, managerWeight: 0.5, customerWeight: 0.3 },
  },
];

const generateInitialRecords = (): PerformanceRecord[] => {
  const users = ['u1', 'u2', 'm1'];
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  const sampleGoalsList = [
    [
      { id: 'g1', description: 'Hoàn thành UI mới cho trang Dashboard', isCompleted: true, resultDescription: 'Đã bàn giao đúng hạn, chất lượng cao' },
      { id: 'g2', description: 'Tối ưu hóa hiệu năng ứng dụng', isCompleted: true, resultDescription: 'Tăng tốc độ tải trang lên 30%' },
    ],
    [
      { id: 'g1', description: 'Tích hợp đa ngôn ngữ i18n Anh/Việt', isCompleted: true, resultDescription: 'Tách riêng file locale, load khi cần' },
      { id: 'g2', description: 'Viết unit test cho các module core', isCompleted: true, resultDescription: 'Đạt 85% code coverage' },
    ],
    [
      { id: 'g1', description: 'Sửa các lỗi tồn đọng từ đợt UAT', isCompleted: true, resultDescription: 'Giải quyết 100% bug critical' },
      { id: 'g2', description: 'Nâng cấp hệ thống báo cáo & biểu đồ', isCompleted: true, resultDescription: 'Hiển thị mượt mà trên mobile' },
    ],
  ];

  // Specific varied base scores per month (all > 90)
  const monthScoreConfigs = [
    { manager: 94, customer: 92, extraDays: 0 }, // 2026-01 -> 94.6
    { manager: 98, customer: 96, extraDays: 0 }, // 2026-02 -> 97.8
    { manager: 93, customer: 95, extraDays: 1 }, // 2026-03 -> 95.9
    { manager: 96, customer: 94, extraDays: 0 }, // 2026-04 -> 96.2
    { manager: 102, customer: 99, extraDays: 1 }, // 2026-05 -> 101.6
    { manager: 95, customer: 98, extraDays: 0 }, // 2026-06 -> 96.9
  ];

  const records: PerformanceRecord[] = [];
  let idCounter = 1;

  users.forEach((userId, userIdx) => {
    months.forEach((month, monthIdx) => {
      const config = monthScoreConfigs[monthIdx];
      // Offset slightly per user so scores differ across users as well as months
      const userOffset = (userIdx * 1.5) - 0.75;
      
      const managerScore = Math.min(105, Math.max(91, Math.round((config.manager + userOffset) * 10) / 10));
      const customerTaskScore = Math.min(105, Math.max(91, Math.round((config.customer - userOffset) * 10) / 10));

      const registeredWorkingDays = 22;
      const actualWorkingDays = registeredWorkingDays + config.extraDays;
      const attendanceScore = (actualWorkingDays / registeredWorkingDays) * 100;

      // Formula: 20% attendance + 50% manager + 30% customer
      const finalScore = Math.round(((attendanceScore * 0.2) + (managerScore * 0.5) + (customerTaskScore * 0.3)) * 10) / 10;

      records.push({
        id: `past_rec_${idCounter++}`,
        userId,
        month,
        registeredWorkingDays,
        actualWorkingDays,
        goals: sampleGoalsList[monthIdx % sampleGoalsList.length].map((g, gIdx) => ({
          ...g,
          id: `g_${idCounter}_${gIdx}`,
        })),
        managerScore,
        customerTaskScore,
        status: 'approved_summary',
        currentReviewLevel: 1,
        finalScore,
      });
    });
  });

  // Mockup data for Approvals menu (pending requests for team t1)
  const approvalMockData: PerformanceRecord[] = [
    {
      id: 'approval_rec_1',
      userId: 'u1', // John Employee
      month: '2026-07',
      registeredWorkingDays: 22,
      actualWorkingDays: 0,
      goals: [
        {
          id: 'g_app_1',
          description: 'Nâng cấp bảo mật Authentication và Session management',
          isCompleted: false,
          resultDescription: '',
        },
        {
          id: 'g_app_2',
          description: 'Tối ưu hóa các API endpoint trong hệ thống',
          isCompleted: false,
          resultDescription: '',
        },
      ],
      managerScore: 0,
      customerTaskScore: 0,
      status: 'pending_registration',
      currentReviewLevel: 1,
    },
    {
      id: 'approval_rec_2',
      userId: 'u2', // Jane Employee
      month: '2026-07',
      registeredWorkingDays: 22,
      actualWorkingDays: 22,
      goals: [
        {
          id: 'g_app_3',
          description: 'Xây dựng giao diện responsive và hỗ trợ đổi ngôn ngữ Anh/Việt với react-i18next',
          isCompleted: true,
          resultDescription: 'Đã hoàn thành 100% giao diện với react-i18next và chuyển đổi dynamic',
        },
        {
          id: 'g_app_4',
          description: 'Cấu hình công thức đánh giá linh hoạt theo phòng ban',
          isCompleted: true,
          resultDescription: 'Đã hoàn thành cấu hình công thức cho các nhóm',
        },
      ],
      managerScore: 0,
      customerTaskScore: 0,
      status: 'pending_summary',
      currentReviewLevel: 1,
    },
  ];

  return [...records, ...approvalMockData];
};

export const useAppStore = create<AppState>((set) => ({
  departments: initialDepartments,
  teams: initialTeams,
  records: generateInitialRecords(),

  updateTeamFormula: (teamId, formula) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === teamId ? { ...t, formula } : t)),
    })),

  createRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),

  updateRecord: (id, updates) =>
    set((state) => {
      const records = state.records.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        
        // Recalculate final score if approved
        if (updated.status === 'approved_summary') {
          const team = state.teams.find(t => {
            const user = useAuthStore.getState().users.find(u => u.id === updated.userId);
            return t.id === user?.teamId;
          });
          if (team) {
            const attendanceScore = (updated.actualWorkingDays / updated.registeredWorkingDays) * 100;
            updated.finalScore = 
              (attendanceScore * team.formula.attendanceWeight) +
              (updated.managerScore * team.formula.managerWeight) +
              (updated.customerTaskScore * team.formula.customerWeight);
          }
        }
        return updated;
      });
      return { records };
    }),
}));
