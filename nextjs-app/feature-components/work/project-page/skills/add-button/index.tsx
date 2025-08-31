import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { SkillInputList } from "./skill-input-list";

// Use the same skill type as defined in other components
type SkillType = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

interface AddFormProps {
  addSkill: (skillId: SkillType) => void;
  addNewSkill: (skillName: string) => void;
  error?: boolean;
}

export const AddForm: React.FC<AddFormProps> = ({
  addSkill,
  addNewSkill,
  error,
}) => {
  const [showInput, setShowInput] = useState(false);

  const handleSkillAdd = (...args: Parameters<typeof addSkill>) => {
    addSkill(...args);
    setShowInput(false);
  };
  const handleNewSkillAdd = (...args: Parameters<typeof addNewSkill>) => {
    addNewSkill(...args);
    setShowInput(false);
  };

  return (
    <div className="inline-flex items-start gap-2">
      <span className="inline-flex gap-2 rounded-full p-1 bg-gray-200 dark:bg-gray-800">
        {(showInput || error) && (
          <SkillInputList
            error={error}
            addSkill={handleSkillAdd}
            addNewSkill={handleNewSkillAdd}
          />
        )}
        <button
          type="button"
          className="rounded-full text-gray-900 dark:text-gray-100 cursor-pointer"
          aria-label="Add skill"
          onClick={() => setShowInput((v) => !v)}
        >
          <PlusCircleIcon />
        </button>
      </span>
    </div>
  );
};
