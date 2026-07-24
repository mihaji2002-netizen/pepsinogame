"use client";

import { useMemo } from "react";
import { getCurriculumSubjects } from "@/lib/exam/curriculum";
import { getGradeTrackLabel } from "@/lib/exam/types";
import type { GradeLevel, StudyTrack } from "@/lib/exam/types";

interface CurriculumTreeProps {
  grade: GradeLevel;
  track: StudyTrack;
  selectedSubjectId?: string;
  selectedChapterId?: string;
  onSelectChapter?: (subjectId: string, chapterId: string) => void;
  compact?: boolean;
}

export default function CurriculumTree({
  grade,
  track,
  selectedSubjectId,
  selectedChapterId,
  onSelectChapter,
  compact = false,
}: CurriculumTreeProps) {
  const subjects = useMemo(() => getCurriculumSubjects(grade, track), [grade, track]);

  if (subjects.length === 0) {
    return <p className="text-sm text-slate-500">برنامه درسی یافت نشد.</p>;
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {!compact && (
        <p className="text-sm text-slate-600">
          دروس اختصاصی <span className="font-medium">{getGradeTrackLabel(grade, track)}</span>
        </p>
      )}
      <div className={`space-y-2 ${compact ? "max-h-64" : "max-h-[28rem]"} overflow-y-auto pr-1`}>
        {subjects.map((subjectItem) => (
          <details
            key={subjectItem.id}
            className="border border-slate-200 rounded-xl bg-white overflow-hidden"
            open={selectedSubjectId === subjectItem.id}
          >
            <summary className="px-4 py-3 cursor-pointer font-medium text-slate-800 hover:bg-emerald-50/50 transition-colors">
              {subjectItem.title}
              <span className="text-xs text-slate-400 font-normal mr-2">
                ({subjectItem.chapters.length} فصل)
              </span>
            </summary>
            <ul className="border-t border-slate-100 divide-y divide-slate-50">
              {subjectItem.chapters.map((chapter) => {
                const isSelected =
                  selectedSubjectId === subjectItem.id && selectedChapterId === chapter.id;
                return (
                  <li key={chapter.id}>
                    {onSelectChapter ? (
                      <button
                        type="button"
                        onClick={() => onSelectChapter(subjectItem.id, chapter.id)}
                        className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-800 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {chapter.title}
                      </button>
                    ) : (
                      <div className="px-4 py-2.5 text-sm text-slate-600">{chapter.title}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
