interface SectionBreakProps {
  label: string;
}

export default function SectionBreak({ label }: SectionBreakProps) {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-black py-16">
      <span className="font-mono text-sm text-white uppercase">{label}</span>
    </div>
  );
}
