import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  ageRange: string;
  incomeRange: string;
  investAmount: string;
  loans: string;
  targetTierTimeline: string;
  marketPreference: string;
  riskProfile: 'Conservative' | 'Balanced' | 'Growth' | null;
}

interface SelectedFund {
  name: string;
  assetClass: string;
  reason: string;
  ytd: string;
}

export interface WealthState {
  // Onboarding session flag — resets on app restart (in-memory only)
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile;
  selectedProduct: string | null;
  selectedFund: SelectedFund | null;
  investmentAmount: number | null;
  // AI assistant
  aiAssistantOpen: boolean;
  aiChatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

type WealthAction =
  | { type: 'COMPLETE_ONBOARDING'; profile: UserProfile }
  | { type: 'SET_RISK_PROFILE'; riskProfile: 'Conservative' | 'Balanced' | 'Growth' }
  | { type: 'SELECT_PRODUCT'; productId: string }
  | { type: 'SELECT_FUND'; fund: SelectedFund }
  | { type: 'SET_INVESTMENT_AMOUNT'; amount: number }
  | { type: 'OPEN_AI_ASSISTANT' }
  | { type: 'CLOSE_AI_ASSISTANT' }
  | { type: 'ADD_AI_MESSAGE'; role: 'user' | 'assistant'; content: string }
  | { type: 'RESET_FLOW' };

// ─── Initial State ────────────────────────────────────────────────────────────

const initialUserProfile: UserProfile = {
  ageRange: '',
  incomeRange: '',
  investAmount: '',
  loans: '',
  targetTierTimeline: '',
  marketPreference: '',
  riskProfile: null,
};

const initialState: WealthState = {
  hasCompletedOnboarding: false,
  userProfile: initialUserProfile,
  selectedProduct: null,
  selectedFund: null,
  investmentAmount: null,
  aiAssistantOpen: false,
  aiChatHistory: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function wealthReducer(state: WealthState, action: WealthAction): WealthState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.profile },
        hasCompletedOnboarding: true,
      };
    case 'SET_RISK_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, riskProfile: action.riskProfile },
      };
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.productId };
    case 'SELECT_FUND':
      return { ...state, selectedFund: action.fund };
    case 'SET_INVESTMENT_AMOUNT':
      return { ...state, investmentAmount: action.amount };
    case 'OPEN_AI_ASSISTANT':
      return { ...state, aiAssistantOpen: true };
    case 'CLOSE_AI_ASSISTANT':
      return { ...state, aiAssistantOpen: false };
    case 'ADD_AI_MESSAGE':
      return {
        ...state,
        aiChatHistory: [
          ...state.aiChatHistory,
          { role: action.role, content: action.content },
        ],
      };
    case 'RESET_FLOW':
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WealthContextValue {
  state: WealthState;
  dispatch: React.Dispatch<WealthAction>;
}

const WealthContext = createContext<WealthContextValue | undefined>(undefined);

export function WealthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wealthReducer, initialState);

  return (
    <WealthContext.Provider value={{ state, dispatch }}>
      {children}
    </WealthContext.Provider>
  );
}

export function useWealth(): WealthContextValue {
  const ctx = useContext(WealthContext);
  if (!ctx) {
    throw new Error('useWealth must be used within a WealthProvider');
  }
  return ctx;
}
