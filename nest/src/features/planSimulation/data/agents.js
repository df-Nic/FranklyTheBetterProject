export const AGENTS = {
  cashflow: {
    id: 'cashflow',
    name: 'Cashflow Lever',
    subtitle: 'Safety & Liquidity',
    iconName: 'DollarSign',
    color: '#8B1A22',
  },
  yield: {
    id: 'yield',
    name: 'Asset Yield Lever',
    subtitle: 'Growth & Returns',
    iconName: 'BarChart3',
    color: '#1F7A4D',
  },
  sequencing: {
    id: 'sequencing',
    name: 'Sequencing / Staging Lever',
    subtitle: 'Timing & Milestones',
    iconName: 'ClipboardList',
    color: '#B4632A',
  },
};

export const JUDGE = {
  id: 'judge',
  name: 'Judge Agent',
  subtitle: 'Evaluating all scenarios',
  iconName: 'Scale',
  color: '#2C2C34',
};

export const AGENT_ORDER = ['cashflow', 'yield', 'sequencing'];
