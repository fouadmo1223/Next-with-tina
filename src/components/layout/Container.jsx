import { cn } from "@/lib/utils";

export default function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag
      className={cn("mx-auto w-[calc(100%-2rem)] max-w-[1200px] 2xl:max-w-[1320px] min-[2400px]:max-w-[1520px] min-[968px]:w-[calc(100%-3rem)]", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
