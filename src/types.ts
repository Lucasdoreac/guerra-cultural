export interface Question {
  id: string;
  category: "econ" | "social";
  text: string;
  subtext: string;
  leftOption: string;  // Tends to Left (Econ) or Libertarian (Social)
  rightOption: string; // Tends to Right (Econ) or Authoritarian (Social)
  neutralOption: string; // Middle ground / undecided
  // The coordinate value mapping: LeftOption corresponds to negative shift, RightOption to positive.
  // We specify the axes directly so we can calculate exact coordinate changes.
  axis: "econ" | "social";
}

export interface UserAnswer {
  questionId: string;
  value: number; // -1 (Left/Lib), 0 (Neutral), 1 (Right/Auth)
}

export interface CompassPosition {
  econ: number;   // -1.0 (Left) to +1.0 (Right)
  social: number; // -1.0 (Libertarian) to +1.0 (Authoritarian)
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DynamicAnalysis {
  analysis: string;
  leftRightShift: number;
  authLibShift: number;
  sides: Array<{ name: string; point: string }>;
}
