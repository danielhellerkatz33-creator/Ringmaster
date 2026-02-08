export default function Loading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border" />
      <main className="flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </main>
    </div>
  )
}
