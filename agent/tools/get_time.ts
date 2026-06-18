import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the current date and time, or convert between timezones.",
  inputSchema: z.object({
    timezone: z.string().default("UTC").describe("IANA timezone (e.g., America/New_York, Asia/Shanghai)"),
  }),
  async execute({ timezone }) {
    try {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", { timeZone: timezone });
      return { timezone, datetime: formatted, iso: now.toISOString(), timestamp: now.getTime() };
    } catch (e: any) {
      return { error: `Invalid timezone: ${timezone}` };
    }
  },
});
