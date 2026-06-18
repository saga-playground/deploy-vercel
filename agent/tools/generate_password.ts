import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Generate a random password with specified length and complexity options.",
  inputSchema: z.object({
    length: z.number().min(4).max(128).default(16).describe("Password length"),
    includeSymbols: z.boolean().default(true).describe("Include special characters"),
    includeNumbers: z.boolean().default(true).describe("Include numbers"),
  }),
  async execute({ length, includeSymbols, includeNumbers }) {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return { password, length, includeSymbols, includeNumbers };
  },
});
