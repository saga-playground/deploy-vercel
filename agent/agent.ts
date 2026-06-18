import { anthropic } from "@ai-sdk/anthropic";
import { defineAgent } from "eve";

export default defineAgent({
  model: anthropic("claude-sonnet-4-20250514"),
  modelContextWindowTokens: 200000,
});
