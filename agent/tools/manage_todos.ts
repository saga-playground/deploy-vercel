import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Manage a simple in-memory todo list. Supports add, list, complete, and remove actions.",
  inputSchema: z.object({
    action: z.enum(["add", "list", "complete", "remove"]).describe("Action to perform"),
    text: z.string().optional().describe("Todo text (for add action)"),
    id: z.number().optional().describe("Todo id (for complete/remove actions)"),
  }),
  async execute({ action, text, id }) {
    // In-memory store (resets per session in real usage)
    const store = (globalThis as any).__todos || [];
    (globalThis as any).__todos = store;

    switch (action) {
      case "add":
        if (!text) return { error: "text is required for add action" };
        const newId = store.length + 1;
        store.push({ id: newId, text, completed: false });
        return { success: true, todo: store[store.length - 1] };
      case "list":
        return { todos: store };
      case "complete":
        const todo = store.find((t: any) => t.id === id);
        if (!todo) return { error: "Todo not found" };
        todo.completed = true;
        return { success: true, todo };
      case "remove":
        const idx = store.findIndex((t: any) => t.id === id);
        if (idx === -1) return { error: "Todo not found" };
        store.splice(idx, 1);
        return { success: true };
    }
  },
});
