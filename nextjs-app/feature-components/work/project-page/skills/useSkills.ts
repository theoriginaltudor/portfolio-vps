import { Tables } from "@/types/database.types";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { detachSkill } from "./actions/detach-skill";
import {
  addExistingSkill,
  addNewSkill as addNewSkillServer,
} from "./actions/add-skill";

export const useUpdateSkills = (
  initialSkills: Tables<"skills">[],
  articleId: number
) => {
  const path = usePathname();
  const [list, setList] = useState<Tables<"skills">[]>(initialSkills);
  const [removeError, setRemoveError] = useState<boolean | undefined>(
    undefined
  );
  const [addError, setAddError] = useState<boolean | undefined>(undefined);

  const removeSkill = useCallback(
    async (skillId: number) => {
      if (typeof skillId !== "number") {
        throw new Error("Invalid skillId");
      }
      const formData = new FormData();
      formData.append("skillId", skillId.toString());
      formData.append("articleId", articleId.toString());
      const removedSkill = initialSkills.find((skill) => skill.id === skillId);
      setList((prev) => prev.filter((skill) => skill.id !== skillId));
      const response = await detachSkill(formData, path);
      setRemoveError(!response.success);
      if (!response.success) {
        setList((prev) => [...prev, removedSkill!]);
      }
    },
    [initialSkills, articleId, path]
  );

  const addSkill = useCallback(
    async (skill: Tables<"skills">) => {
      if (typeof skill.id !== "number") {
        throw new Error("Invalid skillId");
      }
      const formData = new FormData();
      formData.append("skillId", skill.id.toString());
      formData.append("articleId", articleId.toString());
      setList((prev) => [...prev, skill]);
      const response = await addExistingSkill(formData, path);
      setAddError(!response.success);
      if (!response.success) {
        setList((prev) => prev.filter((s) => s.id !== skill.id));
      }
    },
    [articleId, path]
  );

  const addNewSkill = useCallback(
    async (skillName: string) => {
      if (!skillName) {
        throw new Error("Skill name is required");
      }
      const formData = new FormData();
      formData.append("skillName", skillName);
      formData.append("articleId", articleId.toString());
      setList((prev) => [...prev, { id: -1, name: skillName }]);
      const response = await addNewSkillServer(formData, path);
      setAddError(!response.success);
      if (!response.success) {
        setList((prev) => prev.filter((skill) => skill.id !== -1));
      } else {
        if (typeof response.id === "number") {
          const newSkill = { id: response.id, name: skillName };
          setList((prev) =>
            prev.map((skill) => (skill.id === -1 ? newSkill : skill))
          );
        } else {
          // handle error: response.id is not a number
          setAddError(true);
          setList((prev) => prev.filter((skill) => skill.id !== -1));
        }
      }
    },
    [articleId, path]
  );

  return { list, removeSkill, addSkill, addNewSkill, removeError, addError };
};
