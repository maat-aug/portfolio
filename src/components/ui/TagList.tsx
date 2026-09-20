import { Tag } from "@/components/ui/Tag";

type TagListProps = {
  tags: readonly string[];
  variant?: "default" | "accent";
};

export function TagList({ tags, variant }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <li key={index}>
          <Tag label={tag} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
