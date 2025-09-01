import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { detachSkill } from "./actions/detach-skill";
import {
  addExistingSkill,
  addNewSkill as addNewSkillServer,
} from "./actions/add-skill";
import { components } from "@/types/swagger-types";

export const useUpdateSkills = (
  initialSkills: (components["schemas"]["Skill"] | undefined)[],
  articleId: number
) => {
  const path = usePathname();
  const [list, setList] =
    useState<(components["schemas"]["Skill"] | undefined)[]>(initialSkills);
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
      const removedSkill = initialSkills.find((skill) => skill?.id === skillId);
      setList((prev) => prev.filter((skill) => skill?.id !== skillId));
      const response = await detachSkill(formData, path);
      setRemoveError(!response.success);
      if (!response.success) {
        setList((prev) => [...prev, removedSkill!]);
      }
    },
    [initialSkills, articleId, path]
  );

  const addSkill = useCallback(
    async (skill: components["schemas"]["SkillGetDto"]) => {
      if (typeof skill.id !== "number") {
        throw new Error("Invalid skillId");
      }
      const formData = new FormData();
      formData.append("skillId", skill.id.toString());
      formData.append("articleId", articleId.toString());
      // Ensure the skill matches the expected type for the list
      const skillForList: components["schemas"]["Skill"] = {
        id: skill.id,
        name: skill.name || "",
        createdAt: skill.createdAt || "",
        updatedAt: skill.updatedAt || undefined,
      };
      setList((prev) => [...prev, skillForList]);
      const response = await addExistingSkill(formData, path);
      setAddError(!response.success);
      if (!response.success) {
        setList((prev) => prev.filter((s) => s?.id !== skill.id));
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
        setList((prev) => prev.filter((skill) => skill?.id !== -1));
      } else {
        if (typeof response.skillId === "number") {
          const newSkill = { id: response.skillId, name: skillName };
          setList((prev) =>
            prev.map((skill) => (skill?.id === -1 ? newSkill : skill))
          );
        } else {
          // handle error: response.skillId is not a number
          setAddError(true);
          setList((prev) => prev.filter((skill) => skill?.id !== -1));
        }
      }
    },
    [articleId, path]
  );

  return { list, removeSkill, addSkill, addNewSkill, removeError, addError };
};
