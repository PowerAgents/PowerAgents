import { ChatCompletionFunctions } from 'openai-edge';

export async function createReminder(task: string, date: string): Promise<string> {
  // This is a mock function as we don't have a real reminder system
  return `Reminder created: "${task}" for ${date}`;
}

export const reminderFunction: ChatCompletionFunctions = {
  name: 'create_reminder',
  description: 'Create a reminder for a task',
  parameters: {
    type: 'object',
    properties: {
      task: {
        type: 'string',
        description: 'The task to be reminded of',
      },
      date: {
        type: 'string',
        description: 'The date for the reminder (YYYY-MM-DD)',
      },
    },
    required: ['task', 'date'],
  },
};

