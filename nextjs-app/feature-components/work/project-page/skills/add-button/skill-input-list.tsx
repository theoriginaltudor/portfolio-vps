import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/client";
import { useSkillInputList } from "./use-skill-input-list";
import { components } from "@/types/swagger-types";

interface SkillInputListProps {
  error?: boolean;
  addSkill: (skill: components["schemas"]["SkillGetDto"]) => void;
  addNewSkill: (skillName: string) => void;
}

export const SkillInputList: React.FC<SkillInputListProps> = ({
  error,
  addSkill,
  addNewSkill,
}) => {
  const {
    skills,
    selected,
    setSelected,
    ref,
    handleSkillClick,
    handleKeyDown,
  } = useSkillInputList(addSkill, addNewSkill);
  return (
    <span className="relative">
      <Input
        placeholder="Skill"
        ref={ref}
        value={selected.name || ""}
        onChange={(e) => {
          setSelected({ id: -1, name: e.target.value });
        }}
        className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        onKeyDown={handleKeyDown}
      />
      <ul className="mt-2 w-full rounded bg-white dark:bg-gray-900 shadow absolute z-10 bottom-0 left-0 right-0 translate-y-full">
        {selected.id === -1 &&
          skills
            .filter((skill) => skill.name && skill.name.includes(selected.name || ""))
            .map((skill) => (
              <li
                key={skill.id}
                className={cn(
                  "py-1 px-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => handleSkillClick(skill)}
              >
                {skill.name}
              </li>
            ))}
      </ul>
    </span>
  );
};
