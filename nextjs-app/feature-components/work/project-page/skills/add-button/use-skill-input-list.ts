import React, { useRef } from "react";
import { Tables } from "@/types/database.types";

export function useSkillInputList(
  addSkill: (skill: Tables<"skills">) => void,
  addNewSkill: (skillName: string) => void
) {
  const [skills, setSkills] = React.useState<Tables<"skills">[]>([]);
  const [selected, setSelected] = React.useState<Tables<"skills">>({ id: -1, name: "" });
  const ref = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchSkills = async () => {
      const { fetchSkillsServer } = await import("../actions/fetch-skills");
      const data = await fetchSkillsServer();
      setSkills(data);
    };
    fetchSkills();
  }, []);

  const handleSkillClick = (skill: Tables<"skills">) => {
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
