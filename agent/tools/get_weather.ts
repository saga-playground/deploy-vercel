import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the current weather for a city.",
  inputSchema: z.object({
    city: z.string().min(1).describe("City name"),
  }),
  async execute({ city }) {
    const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperatureF = Math.floor(Math.random() * 60) + 30;
    return { city, condition, temperatureF, humidity: `${Math.floor(Math.random() * 60) + 30}%` };
  },
});
