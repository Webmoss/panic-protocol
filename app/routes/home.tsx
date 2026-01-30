import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "🚨 Panic Protocol" },
    { name: "description", content: "Panic Protocol is an emergency stop button for hacked wallets." },
  ];
}

export default function Home() {
  return <Welcome />;
}
