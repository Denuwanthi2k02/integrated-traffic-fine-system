// ─────────────────────────────────────────────
//  services/api.js
//  Mock data layer — swap axios calls when backend (Member 1 & 2) is ready
// ─────────────────────────────────────────────
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Mock Data ────────────────────────────────

export const MOCK_SUMMARY = {
  totalRevenue: 4218500,
  totalFines: 3847,
  pendingFines: 641,
  settledFines: 3206,
  topViolation: 'Speeding',
  revenueGrowth: 12.4,
  fineGrowth: 8.1,
}

export const MOCK_DISTRICTS = [
  { name: 'Colombo',    revenue: 1100000, fines: 980,  settled: 832,  pending: 148 },
  { name: 'Gampaha',   revenue: 780000,  fines: 712,  settled: 601,  pending: 111 },
  { name: 'Kandy',     revenue: 620000,  fines: 543,  settled: 471,  pending: 72  },
  { name: 'Kurunegala',revenue: 480000,  fines: 421,  settled: 358,  pending: 63  },
  { name: 'Galle',     revenue: 360000,  fines: 310,  settled: 265,  pending: 45  },
  { name: 'Jaffna',    revenue: 290000,  fines: 248,  settled: 211,  pending: 37  },
  { name: 'Matara',    revenue: 210000,  fines: 187,  settled: 156,  pending: 31  },
  { name: 'Ratnapura', revenue: 175000,  fines: 155,  settled: 128,  pending: 27  },
  { name: 'Badulla',   revenue: 140000,  fines: 124,  settled: 101,  pending: 23  },
  { name: 'Anuradhapura', revenue: 130000, fines: 167, settled: 83, pending: 84  },
]

export const MOCK_CATEGORIES = [
  { name: 'Speeding',         count: 1616, revenue: 1616000, fineAmount: 3000 },
  { name: 'No License',       count: 923,  revenue: 1153750, fineAmount: 5000 },
  { name: 'Illegal Parking',  count: 693,  revenue: 346500,  fineAmount: 1500 },
  { name: 'Drunk Driving',    count: 385,  revenue: 962500,  fineAmount: 25000 },
  { name: 'Using Phone',      count: 154,  revenue: 77000,   fineAmount: 3000 },
  { name: 'No Seatbelt',      count: 76,   revenue: 38000,   fineAmount: 1000 },
]

export const MOCK_MONTHLY = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  revenue: [2800000, 3100000, 2950000, 3400000, 3750000, 4218500],
  fines:   [2410,    2680,    2530,    2920,    3210,    3847],
}

export const MOCK_TRANSACTIONS = [
  { id: 'TF-20260611-4821', category: 'Speeding',        district: 'Colombo',     amount: 3000,  date: '2026-06-11', status: 'paid',    officer: 'SI Perera' },
  { id: 'TF-20260611-4820', category: 'No License',      district: 'Gampaha',     amount: 5000,  date: '2026-06-11', status: 'paid',    officer: 'SGT Fernando' },
  { id: 'TF-20260611-4819', category: 'Illegal Parking', district: 'Kandy',       amount: 1500,  date: '2026-06-11', status: 'pending', officer: 'PC Silva' },
  { id: 'TF-20260610-4818', category: 'Drunk Driving',   district: 'Colombo',     amount: 25000, date: '2026-06-10', status: 'paid',    officer: 'SI Jayawardena' },
  { id: 'TF-20260610-4817', category: 'Speeding',        district: 'Galle',       amount: 3000,  date: '2026-06-10', status: 'pending', officer: 'SGT Wijeratne' },
  { id: 'TF-20260609-4816', category: 'No License',      district: 'Jaffna',      amount: 5000,  date: '2026-06-09', status: 'paid',    officer: 'PC Rajapaksa' },
  { id: 'TF-20260609-4815', category: 'Using Phone',     district: 'Kurunegala',  amount: 3000,  date: '2026-06-09', status: 'paid',    officer: 'SI Bandara' },
  { id: 'TF-20260609-4814', category: 'No Seatbelt',     district: 'Matara',      amount: 1000,  date: '2026-06-09', status: 'pending', officer: 'SGT Kumara' },
  { id: 'TF-20260608-4813', category: 'Drunk Driving',   district: 'Gampaha',     amount: 25000, date: '2026-06-08', status: 'paid',    officer: 'SI Dissanayake' },
  { id: 'TF-20260608-4812', category: 'Speeding',        district: 'Colombo',     amount: 3000,  date: '2026-06-08', status: 'paid',    officer: 'PC Gunasekara' },
]

// ── API Functions (swap mock → real when backend ready) ──────────────────────

export const getAdminSummary = async (filters = {}) => {
  // TODO: return api.get('/admin/summary', { params: filters })
  return new Promise(resolve => setTimeout(() => resolve(MOCK_SUMMARY), 400))
}

export const getDistrictCollections = async (filters = {}) => {
  // TODO: return api.get('/admin/districts', { params: filters })
  return new Promise(resolve => setTimeout(() => resolve(MOCK_DISTRICTS), 400))
}

export const getCategoryBreakdown = async (filters = {}) => {
  // TODO: return api.get('/admin/categories', { params: filters })
  return new Promise(resolve => setTimeout(() => resolve(MOCK_CATEGORIES), 400))
}

export const getMonthlyTrend = async (filters = {}) => {
  // TODO: return api.get('/admin/monthly', { params: filters })
  return new Promise(resolve => setTimeout(() => resolve(MOCK_MONTHLY), 400))
}

export const getRecentTransactions = async (filters = {}) => {
  // TODO: return api.get('/admin/transactions', { params: filters })
  let data = [...MOCK_TRANSACTIONS]
  if (filters.district && filters.district !== 'all') {
    data = data.filter(t => t.district.toLowerCase() === filters.district.toLowerCase())
  }
  if (filters.status && filters.status !== 'all') {
    data = data.filter(t => t.status === filters.status)
  }
  if (filters.category && filters.category !== 'all') {
    data = data.filter(t => t.category === filters.category)
  }
  return new Promise(resolve => setTimeout(() => resolve(data), 300))
}

export const loginAdmin = async (credentials) => {
  // TODO: return api.post('/auth/login', credentials)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        resolve({ token: 'mock-jwt-token-xyz', role: 'SUPER_ADMIN', name: 'SP Nimal Silva' })
      } else {
        reject(new Error('Invalid username or password'))
      }
    }, 600)
  })
}

export default api
