import { Tool, ToolItem } from "@/components/dashboard/tool-item";
import {
  AvocadoIcon,
  BrainIcon,
  LinkedinLogoIcon,
  PiggyBankIcon,
  PizzaIcon,
} from "@phosphor-icons/react/dist/ssr";

const DashBoardPage = () => {
  const tools: Tool[] = [
    {
      name: "Job Compass",
      description: "Helps you track your current job applications.",
      icon: <LinkedinLogoIcon weight="bold" size={40} className="shrink-0" />,
      href: "/job-tracker",
      // comingSoon: true,
    },
    {
      name: "Todo Lists",
      description:
        "Your second brain that collects every thought you could've think of.",
      icon: <BrainIcon weight="bold" size={40} className="shrink-0" />,
      href: "/todos",
      comingSoon: true,
    },
    {
      name: "Recipe Book",
      description:
        "Recommends you what to eat now and collects step-by-step instructions how to make your delicious snacks.",
      icon: <PizzaIcon weight="bold" size={40} className="shrink-0" />,
      href: "/recipes",
      comingSoon: true,
    },
    {
      name: "Calorie Tracker",
      description: "Counts what you eat throughout the day.",
      icon: <AvocadoIcon weight="bold" size={40} className="shrink-0" />,
      href: "/calories",
      comingSoon: true,
    },
    {
      name: "Budget planner",
      description: "Helps you save some money.",
      icon: <PiggyBankIcon weight="bold" size={40} className="shrink-0" />,
      href: "/expenses",
      comingSoon: true,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
      {tools.map((tool) => (
        <ToolItem {...tool} key={tool.name} />
      ))}
    </div>
  );
};

export default DashBoardPage;
