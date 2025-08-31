import React, { useRef } from "react";
import { components } from "@/types/swagger-types";

// Create a local type for the skills that match what we expect
type SkillType = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export function useSkillInputList(
  addSkill: (skill: SkillType) => void,
  addNewSkill: (skillName: string) => void
) {
  const [skills, setSkills] = React.useState<SkillType[]>([]);
  const [selected, setSelected] = React.useState<SkillType>({ id: -1, name: "" });
  const ref = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchSkills = async () => {
      const { fetchSkillsServer } = await import("../actions/fetch-skills");
      const data = await fetchSkillsServer();
      // Convert API response to our internal type, filtering out invalid entries
      const validSkills: SkillType[] = data
        .filter((skill): skill is components["schemas"]["SkillGetDto"] & { id: number; name: string } => 
          skill.id != null && skill.name != null
        )
        .map(skill => ({
          id: skill.id,
          name: skill.name,
          createdAt: skill.createdAt || undefined,
          updatedAt: skill.updatedAt || undefined,
        }));
      setSkills(validSkills);
    };
    fetchSkills();
  }, []);

  const handleSkillClick = (skill: SkillType) => {
    setSelected(skill);
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selected.name.trim() !== "") {
      if (selected.id === -1) {
        addNewSkill(selected.name.trim());
      } else {
        addSkill(selected);
      }
      setSelected({ id: -1, name: "" });
    }
  };

  return {
    skills,
    selected,
    setSelected,
    ref,
    handleSkillClick,
    handleKeyDown,
  };
}
