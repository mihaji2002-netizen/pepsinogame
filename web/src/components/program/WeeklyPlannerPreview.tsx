"use client";

import { paletteCssVars } from "@/lib/program/color-palette";
import { LAB_OPTIONS } from "@/lib/program/defaults";
import type { WeeklyProgram } from "@/lib/program/types";
import "@/styles/program-planner.css";

function bgClass(id: WeeklyProgram["backgroundId"]) {
  switch (id) {
    case "neuron-watermark":
      return "bg-neuron-watermark";
    case "clean-white":
      return "bg-clean-white";
    case "subject-gradient":
      return "bg-subject-gradient";
    default:
      return "bg-neuro-lab";
  }
}

function Text({
  value,
  en = false,
  className = "",
}: {
  value: string;
  en?: boolean;
  className?: string;
}) {
  if (!value) return <span className={`opacity-40 ${className}`}>—</span>;
  return (
    <span className={`${en ? "planner-en" : "planner-fa"} ${className}`}>{value}</span>
  );
}

export default function WeeklyPlannerPreview({ program }: { program: WeeklyProgram }) {
  const palette = program.subjectTheme.palette;
  const labLabel = LAB_OPTIONS.find((l) => l.id === program.lab)?.label ?? program.lab;

  return (
    <div
      className="planner-preview-root"
      style={paletteCssVars(palette) as React.CSSProperties}
    >
      <div className={`planner-sheet ${bgClass(program.backgroundId)}`}>
        <header className="planner-header">
          <div className="planner-header-box">
            <div className="planner-en planner-title">NEURO LAB</div>
            <div className="planner-en planner-subtitle">GET ACTIVE TO GROW</div>
            <div className="planner-en planner-subtitle">NEURO DEPARTMENT</div>
          </div>

          <div className="planner-header-box">
            <div className="planner-label planner-en">SUBJECT NAME</div>
            <div className="planner-value planner-fa">
              <Text value={program.subjectName || program.subjectTheme.name} />
            </div>
            <div className="planner-label planner-en mt-1">SUBJECT ID</div>
            <div className="planner-value">
              <Text value={program.subjectId} en />
            </div>
            <div className="planner-label planner-en mt-1">LAB</div>
            <div className="planner-value planner-en">{labLabel}</div>
          </div>

          <div className="planner-header-box">
            <div className="flex flex-wrap gap-1">
              {[
                ["LEVEL", program.level],
                ["XP", program.xp],
                ["RANK", program.rank],
              ].map(([label, val]) => (
                <div key={label} className="planner-stat-pill">
                  <span className="planner-en planner-label">{label}</span>
                  <span className="planner-value">
                    <Text value={val as string} en />
                  </span>
                </div>
              ))}
            </div>
            <div className="planner-label planner-en mt-2">NEXT LEVEL</div>
            <div className="planner-value">
              <Text value={program.nextLevelXp ? `${program.nextLevelXp} XP` : ""} en />
            </div>
          </div>
        </header>

        <div className="planner-body">
          <aside className="planner-sidebar">
            <div className="planner-side-panel">
              <div className="planner-side-title planner-en">ROUTINE</div>
              {program.routines.map((item) => (
                <div key={item.id} className="planner-routine-item">
                  <span className="planner-check" />
                  <Text value={item.label} />
                </div>
              ))}
            </div>
            <div className="planner-side-panel">
              <div className="planner-side-title planner-en">WEEKLY MISSIONS</div>
              {program.missions.map((item, index) => (
                <div key={item.id} className="planner-mission-item">
                  <span className="planner-en">{String(index + 1).padStart(2, "0")}</span>
                  <span className="planner-check" />
                  <Text value={item.label} />
                </div>
              ))}
            </div>
          </aside>

          <div className="planner-grid-wrap">
            <table className="planner-grid">
              <thead>
                <tr>
                  <th className="planner-en">DAY</th>
                  <th className="planner-en">ROUTINE</th>
                  <th className="planner-en">T6</th>
                  <th className="planner-en">T5</th>
                  <th className="planner-en">T4</th>
                  <th className="planner-en">T3</th>
                  <th className="planner-en">T2</th>
                  <th className="planner-en">T1</th>
                </tr>
              </thead>
              <tbody>
                {program.gridRows.map((row) => (
                  <tr key={row.id}>
                    <td className="day-col">
                      <div className="planner-fa">{row.dayLabel}</div>
                      <div className="planner-day-icon">{row.dayIcon}</div>
                    </td>
                    <td>
                      <div className="planner-cell">
                        <Text value={row.routine} />
                      </div>
                    </td>
                    {[row.target6, row.target5, row.target4, row.target3, row.target2, row.target1].map(
                      (cell, i) => (
                        <td key={i}>
                          <div className="planner-cell">
                            <Text value={cell} />
                          </div>
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="planner-footer">
          <div className="planner-footer-box">
            <h4 className="planner-en">Weekly Report</h4>
            <div className="planner-footer-line">
              ساعت مطالعه: <Text value={program.weeklyReport.studyHours} />
            </div>
            <div className="planner-footer-line">
              درصد تست: <Text value={program.weeklyReport.testPercentage} />
            </div>
            <div className="planner-footer-line">
              نقاط قوت: <Text value={program.weeklyReport.strengths} />
            </div>
            <div className="planner-footer-line">
              نقاط ضعف: <Text value={program.weeklyReport.weaknesses} />
            </div>
            <div className="planner-footer-line">
              Mission هفته بعد: <Text value={program.weeklyReport.nextWeekMission} />
            </div>
          </div>
          <div className="planner-footer-box">
            <h4 className="planner-en">Weekly Notes</h4>
            <div className="planner-footer-text planner-fa">{program.weeklyNotes || "—"}</div>
          </div>
          <div className="planner-footer-box">
            <h4 className="planner-en">Weekly Reflection</h4>
            <div className="planner-footer-text planner-fa">{program.weeklyReflection || "—"}</div>
          </div>
          <div className="planner-footer-box">
            <h4 className="planner-en">Subject of the Week</h4>
            <div className="planner-footer-line">
              Level: <Text value={program.subjectOfWeek.level} en />
            </div>
            <div className="planner-footer-line">
              XP: <Text value={program.subjectOfWeek.xp} en />
            </div>
            <div className="planner-footer-line">
              Streak: <Text value={program.subjectOfWeek.streak} en />
            </div>
          </div>
        </footer>

        <div className="planner-bottom-bar planner-en">
          NEURO LAB • FOCUS • LEARN • ADAPT • EVOLVE • LEGEND HALL
        </div>
      </div>
    </div>
  );
}
