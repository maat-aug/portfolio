import { TagList } from "@/components/ui/TagList";
import type { StackGroup } from "@/domain/site";

type StackGridProps = {
  groups: readonly StackGroup[];
};

export function StackGrid({ groups }: StackGridProps) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2">
      {groups.map((group, index) => (
        <li key={index} className="rounded-2xl border border-line bg-surface/65 p-5 transition-colors hover:border-accent/35 hover:bg-surface-raised sm:p-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink">
            {group.label}
          </h3>
          <div className="mt-4 border-t border-line pt-4">
            <TagList tags={group.items} />
          </div>
        </li>
      ))}
    </ul>
  );
}
