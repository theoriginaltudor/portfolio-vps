"use client";
import React from "react";
import { RemoveButton } from "./remove-button";
import { AddForm } from "./add-button";
import { useUpdateSkills } from "./useSkills";
import { components } from "@/types/swagger-types";

interface SkillsProps {
  skills: (components["schemas"]["Skill"] | undefined)[];
  articleId: number;
  edit?: boolean;
}

export const Skills: React.FC<SkillsProps> = ({
  skills,
  edit = false,
  articleId,
}) => {
  const { list, removeSkill, addSkill, addNewSkill, removeError, addError } =
    useUpdateSkills(skills, articleId);

  return (
    <div className="max-w-2xl w-full px-4 mt-8">
      <h2 className="text-xl font-semibold mb-2">Skills:</h2>
      <div className="flex flex-wrap gap-2">
        {list.map(
          (skill) =>
            skill && (
              <span
                key={skill.id}
                className="inline-flex gap-2 items-center rounded-full px-3 py-1 text-sm bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              >
                {skill.name}{" "}
                {edit && (
                  <RemoveButton
                    id={skill.id as number}
                    handleClick={removeSkill}
                    error={removeError}
                  />
                )}
              </span>
            )
        )}
        {edit && (
          <AddForm
            addSkill={addSkill}
            addNewSkill={addNewSkill}
            error={addError}
          />
        )}
      </div>
    </div>
  );
};
