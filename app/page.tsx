import CsvGenerator from "@/components/Generate";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CsvGenerator />
      </div>
    </main>
  );
}
