export function LibrarySkeleton() {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="space-y-8">
                {/* CONTAINER PRINCIPAL MIMETIZANDO O CARD DA BIBLIOTECA */}
                <div className="card bg-base-100 p-6 md:p-10 rounded-[40px] shadow-sm border border-base-200 relative overflow-hidden">
                    
                    {/* HEADER SKELETON */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 px-4">
                        <div className="space-y-3 w-full md:w-1/3">
                            <div className="skeleton h-10 w-full rounded-lg"></div>
                            <div className="skeleton h-4 w-24 rounded-full opacity-50"></div>
                        </div>
                        <div className="skeleton h-16 w-full md:w-40 rounded-2xl hidden md:block"></div>
                    </div>

                    {/* GRID SKELETON (Simulando os cards de livros) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-4 w-full">
                                {/* O "Livro" */}
                                <div className="skeleton aspect-[2/3] w-full rounded-[32px]"></div>
                                {/* O Título e Autor */}
                                <div className="space-y-2 px-1">
                                    <div className="skeleton h-3 w-full rounded-full"></div>
                                    <div className="skeleton h-3 w-2/3 rounded-full opacity-60"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}