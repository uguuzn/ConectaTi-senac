import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConectaTI Senac" },
      { name: "description", content: "Sistema de chamados, salas e gestão do Senac." },
    ],
  }),
  component: Index,
});

function Index() {
  const nav = useNavigate();
  useEffect(() => { nav({ to: "/home", replace: true }); }, [nav]);
  return null;
}
