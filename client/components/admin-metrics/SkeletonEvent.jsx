import { Skeleton } from "@mui/material";

// Skeleton event component (active during event fetching; mirrors the dimension of a singular event)
export default function SkeletonEvent() {
    return (
        <div className="flex flex-col gap-1 px-5">
            <div className="flex justify-between text-xl">
                <Skeleton className="!bg-[#5A7F97] w-[45%]"/>
                <Skeleton className="!bg-[#5A7F97] w-[42%]"/>
            </div>
            <Skeleton className="!bg-[#5A7F97] w-[45%] text-xl"/>
            <ul className="list-disc list-inside pl-4">
                {Array(3).fill(0).map((_, j) => (
                    <Skeleton key={j} className="!bg-[#5A7F97] w-2/3"/>
                ))}
            </ul>
        </div>
    );
}