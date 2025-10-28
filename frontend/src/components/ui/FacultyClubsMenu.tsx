import { useState, type ReactNode } from 'react';
import { facultyClubsData } from '../../lib/facultyClubsData';
import { Laptop2, CircuitBoard, LineChart, Globe, Calculator, Scale, GraduationCap, ChevronDown, Trophy } from 'lucide-react';

type Props = {
  label?: string;
  align?: 'left' | 'right';
};

const iconByKey: Record<string, ReactNode> = {
  cntt: <Laptop2 size={18} />,
  vkte: <CircuitBoard size={18} />,
  kt: <LineChart size={18} />,
  nn: <Globe size={18} />,
  co: <Calculator size={18} />,
  ql: <Scale size={18} />,
  sp: <GraduationCap size={18} />,
  cnvh: <Trophy size={18} />,
};

export function FacultyIcon({ keyName }: { keyName: string }) {
  const icon = iconByKey[keyName] ?? <GraduationCap size={18} />;
  return (
    <div className="h-8 w-8 grid place-items-center rounded-md bg-blue-50 text-blue-600 border border-blue-100">
      {icon}
    </div>
  );
}

export default function FacultyClubsMenu({ label = 'Câu lạc bộ theo Trường/Khoa/Viện', align = 'left' }: Props) {
  const [open, setOpen] = useState(false);
  const alignClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute ${alignClass} top-full mt-2 w-[640px] bg-white border rounded-xl shadow-xl z-50 max-h-[70vh] overflow-y-auto`}> 
          <div className="p-4 space-y-3">
            {facultyClubsData.map((fac) => (
              <details key={fac.key} className="group">
                <summary className="flex items-center justify-between cursor-pointer select-none p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FacultyIcon keyName={fac.key} />
                    <span className="text-sm font-semibold text-gray-900">{fac.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pl-4 pr-2 pb-2 space-y-2">
                  {fac.clubs.map((c) => (
                    <a
                      key={c.name}
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 border border-gray-100"
                    >
                      <img src={c.logo} alt={c.name} className="h-8 w-8 rounded object-cover border" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-gray-600 truncate">{c.desc}</div>
                        {('president' in c && (c as any).president) ? (
                          <div className="text-[10px] text-gray-500 truncate mt-0.5">
                            <span className="font-medium">Chủ nhiệm:</span> {(c as any).president}
                          </div>
                        ) : null}
                      </div>
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
