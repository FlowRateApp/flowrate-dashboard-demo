export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Flowrate Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Lightning Network liquidity management platform
        </p>
        <div className="space-x-4">
          <a
            href="/treasury"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Treasury Dashboard
          </a>
          <a
            href="/subscriber"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Subscriber Dashboard
          </a>
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}

