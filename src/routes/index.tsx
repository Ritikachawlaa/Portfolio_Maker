import { createFileRoute } from "@tanstack/react-router";
import { PortfolioAIApp } from "@/components/portfolio-ai/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PortfolioAI Generator — Build your live developer portfolio" },
      { name: "description", content: "Connect profiles, upload docs, pick a template, and deploy your portfolio with PortfolioAI." },
    ],
  }),
  component: Index,
});

function Index() {
  return <PortfolioAIApp />;
}
