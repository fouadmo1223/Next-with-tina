import Image from "next/image";

const stats = [
  { key: "nationality", icon: "/home/profiles-globe.svg", tone: "bg-[#f3edf7]" },
  { key: "profession", icon: "/home/profiles-user-round.svg", tone: "bg-[#eef7f5]" },
  { key: "age", icon: "/home/profiles-calendar-days.svg", tone: "bg-[#eef7f5]" },
  { key: "experience", icon: "/home/profiles-briefcase-business.svg", tone: "bg-[#f3edf7]" },
];

// `light` swaps the lilac boxes for white ones, for cards that already sit on lilac.
export default function CvQuickStats({ stats: values, light }) {
  return (
    <dl className="grid grid-cols-2 gap-2">
      {stats.filter((stat) => values[stat.key]?.value).map((stat) => (
        <div key={stat.key} className={`rounded-[10px] px-2.5 py-2.5 ${light && stat.tone === "bg-[#f3edf7]" ? "bg-white" : stat.tone}`}>
          <dt className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[#5d5861]">
            <Image src={stat.icon} alt="" width={15} height={15} className="size-[15px] shrink-0" />
            {values[stat.key].label}
          </dt>
          <dd className="mt-1 text-[13px] leading-[1.4] font-bold text-[#2f2835]">{values[stat.key].value}</dd>
        </div>
      ))}
    </dl>
  );
}
