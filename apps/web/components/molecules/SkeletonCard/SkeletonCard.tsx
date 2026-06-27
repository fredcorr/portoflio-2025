const SkeletonCard = () => (
  <div className="flex animate-pulse flex-col">
    <div className="aspect-[3/2] bg-foreground/[0.06]" />
    <div className="flex flex-col gap-2.5 px-4 py-3.5">
      <div className="flex justify-between">
        <div className="h-3 w-16 rounded-sm bg-foreground/[0.06]" />
        <div className="h-3 w-12 rounded-sm bg-foreground/[0.06]" />
      </div>
      <div className="h-5 w-3/4 rounded-sm bg-foreground/[0.06]" />
      <div className="h-4 w-1/2 rounded-sm bg-foreground/[0.06]" />
      <div className="mt-2 flex justify-between border-t border-foreground/10 pt-4">
        <div className="h-3 w-20 rounded-sm bg-foreground/[0.06]" />
        <div className="h-3 w-14 rounded-sm bg-foreground/[0.06]" />
      </div>
    </div>
  </div>
)

export default SkeletonCard
