import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "*/5 * * * *",
  markdown: "Check system health: verify all tools are responsive and log any anomalies.",
});
