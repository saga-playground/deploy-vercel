import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Search for information on a topic (simulated for demo).",
  inputSchema: z.object({
    query: z.string().min(1).describe("Search query"),
  }),
  async execute({ query }) {
    return {
      results: [
        { title: `Result 1 for "${query}"`, snippet: `This is a simulated search result about ${query}.` },
        { title: `Result 2 for "${query}"`, snippet: `Another perspective on ${query} from a different source.` },
      ],
    };
  },
});
