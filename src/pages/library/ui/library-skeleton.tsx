import { Skeleton } from "../../../shared/ui/skeleton";

export function LibrarySkeleton() {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-input p-10 rounded-[40px] shadow-sm border border-border/40 relative overflow-hidden">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-[250px]"/>
                        <Skeleton className="h-[120px] w-full rounded-xl"/>
                    </div>

                    <div className="space-y-4">
                        {Array.from({ length: 5}).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-2 border rounded-lg">
                                <Skeleton className="h-12 w-12 rounded-md"/>
                                <div>
                                    <Skeleton className="h-4 w-[40%]"/>
                                    <Skeleton className="h-4 w-[20%]"/>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}