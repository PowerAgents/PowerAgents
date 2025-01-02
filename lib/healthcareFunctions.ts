import { ChatCompletionFunctions } from 'openai-edge';

export async function getHealthTip(): Promise<string> {
  const tips = [
    "Drink at least 8 glasses of water a day.",
    "Aim for 30 minutes of exercise 5 days a week.",
    "Eat a variety of fruits and vegetables daily.",
    "Get 7-9 hours of sleep each night.",
    "Practice mindfulness or meditation to reduce stress.",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export const healthTipFunction: ChatCompletionFunctions = {
  name: 'get_health_tip',
  description: 'Get a random health tip',
  parameters: {
    type: 'object',
    properties: {},
  },
};

