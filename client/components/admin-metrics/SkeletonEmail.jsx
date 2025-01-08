import { Skeleton } from "@mui/material";

// Skeleton email component (active during email fetching; mirrors the dimensions of a singular email)
export default function SkeletonEmail() {
    return (
        <div className="flex gap-5 px-5">
            <Skeleton className="!bg-[#5A7F97] w-1/3"/>
            <Skeleton className="!bg-[#5A7F97] w-1/3"/>
            <Skeleton className="!bg-[#5A7F97] w-1/3"/>
        </div>
    );
}