import React from 'react';

export interface QuestionData {
  id: number;
  title: string;
  category: string;
  question: string;
  codeSnippet: string;
  answer: string;
  explanation: string;
  fixedCode: string;
  BuggyDemo: React.FC;
  FixedDemo: React.FC;
}
