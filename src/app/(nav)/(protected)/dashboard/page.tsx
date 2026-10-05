import { BrandHeading } from "@/components/brand/brand-heading";
import { Tool, ToolItem } from "@/components/dashboard/tool-item";
import {
  AvocadoIcon,
  BrainIcon,
  LinkedinLogoIcon,
  PiggyBankIcon,
  PizzaIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

const DashBoardPage = async () => {
  const t = await getTranslations("dashboard");

  const tools: Tool[] = [
    {
      id: "job_compass",
      icon: <LinkedinLogoIcon weight="bold" size={40} className="shrink-0" />,
      href: "/jobs",
      // comingSoon: true,
    },
    {
      id: "todo_lists",
      icon: <BrainIcon weight="bold" size={40} className="shrink-0" />,
      href: "/todos",
      comingSoon: true,
    },
    {
      id: "recipe_book",
      icon: <PizzaIcon weight="bold" size={40} className="shrink-0" />,
      href: "/recipes",
      comingSoon: true,
    },
    {
      id: "calorie_tracker",
      icon: <AvocadoIcon weight="bold" size={40} className="shrink-0" />,
      href: "/calories",
      comingSoon: true,
    },
    {
      id: "budget_planner",
      icon: <PiggyBankIcon weight="bold" size={40} className="shrink-0" />,
      href: "/expenses",
      comingSoon: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <BrandHeading
        text={t("heading")}
        variant="pageHeading"
        size="gigantic"
        className="md:text-center"
      />
      <BrandHeading
        text={t("subheading")}
        size="large"
        className="md:text-center"
        variant="pageHeading"
      />
      <div className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {tools.map((tool) => (
          <ToolItem {...tool} key={tool.id} />
        ))}
      </div>
    </div>
  );
};

export default DashBoardPage;
