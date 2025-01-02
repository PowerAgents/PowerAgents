import { ChatCompletionFunctions } from 'openai-edge';

export async function getWeatherInfo(location: string): Promise<string> {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=8bddf8f09bdc47beaca220700241612&q=${location}`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    return JSON.stringify({
      location: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return JSON.stringify({ error: 'Unable to fetch weather information' });
  }
}

export async function getFlightInfo(from: string, to: string): Promise<string> {
  // This is a mock function as we don't have a real flight API
  const mockFlights = [
    { flightNumber: 'AA123', departure: '10:00 AM', arrival: '12:00 PM', price: '$300' },
    { flightNumber: 'UA456', departure: '2:00 PM', arrival: '4:00 PM', price: '$350' },
  ];
  return JSON.stringify(mockFlights);
}

export const weatherFunction: ChatCompletionFunctions = {
  name: 'get_weather',
  description: 'Get the current weather for a given location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and state, e.g. San Francisco, CA',
      },
    },
    required: ['location'],
  },
};

export const flightFunction: ChatCompletionFunctions = {
  name: 'get_flight_info',
  description: 'Get flight information between two locations',
  parameters: {
    type: 'object',
    properties: {
      from: {
        type: 'string',
        description: 'The departure city',
      },
      to: {
        type: 'string',
        description: 'The arrival city',
      },
    },
    required: ['from', 'to'],
  },
};

