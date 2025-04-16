import { Card } from "../ui/Card"
import { Skeleton } from "../ui/Skeleton"

export const FeedSkeletonLoading = () => {
    return (
        <div className="w-full col-span-2 flex flex-col gap-6">
            <Card className="w-full p-6 grid gap-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
                <Skeleton className="h-48 rounded-lg" />
            </Card>
            <Card className="w-full  p-6 grid gap-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
                <Skeleton className="h-48 rounded-lg" />
            </Card>
            <Card className="w-full p-6 grid gap-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
                <Skeleton className="h-48 rounded-lg" />
            </Card>
        </div>
    )
}