import { ChatCompletionFunctions } from 'openai-edge';
import { getCryptoPrice, cryptoPriceFunction } from './tradingFunctions';
import { getWeatherInfo, weatherFunction } from './travelFunctions';
import { getFlightInfo, flightFunction } from './travelFunctions';
import { getHealthTip, healthTipFunction } from './healthcareFunctions';
import { getNFTInfo, nftInfoFunction } from './nftFunctions';
import { createReminder, reminderFunction } from './personalFunctions';

// Function definitions
export const availableFunctions: Record<string, Function> = {
  get_weather: getWeatherInfo,
  get_crypto_price: getCryptoPrice,
  get_flight_info: getFlightInfo,
  get_health_tip: getHealthTip,
  get_nft_info: getNFTInfo,
  create_reminder: createReminder,
};

export {
  cryptoPriceFunction,
  weatherFunction,
  flightFunction,
  healthTipFunction,
  nftInfoFunction,
  reminderFunction
};

