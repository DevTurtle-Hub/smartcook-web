import { resolveCookingCommand } from './cookingCommands';

export function cookingStepAnnouncement(step: { stepNumber: number; title: string; description: string }, previous?: number): string {
  const prefix = previous === undefined ? 'Bắt đầu hướng dẫn nấu ăn.'
    : step.stepNumber < previous ? `Đã quay lại bước ${step.stepNumber}.` : `Đã chuyển sang bước ${step.stepNumber}.`;
  const instruction = resolveCookingCommand('Đọc lại', { currentStep: step })!.speechReply;
  return `${prefix} ${instruction}`;
}
