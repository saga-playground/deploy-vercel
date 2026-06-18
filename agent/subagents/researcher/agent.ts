import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-4-20250514",
  description: "A specialist subagent for deep research tasks. Delegates complex information-gathering to a focused researcher.",
});
