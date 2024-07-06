import CsvGenerator from "@/components/Generate";

export default function Home() {
  // Sample data, possibly fetched from an API or defined statically
  const sampleData = [
    { source: "/index", destination: "/", permanent: true },
    // Additional sample data objects can be added here
  ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CsvGenerator initialData={sampleData} />
      </div>
    </main>
  );
}
