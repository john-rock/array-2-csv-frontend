import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitBranch, FileSpreadsheet } from "lucide-react";

export function Navbar() {
  return (
    <header className="flex h-16 w-full items-center fixed top-0 justify-between bg-background px-4 md:px-6 border-b border-solid">
      <Link href="#" className="flex items-center gap-2">
        <FileSpreadsheet />
        <span className="text-lg font-semibold">array-2-csv</span>
      </Link>
      <Link href="https://github.com/john-rock/array-2-csv-frontend" target="_blank">
        <Button variant="ghost" size="icon" className="rounded-full">
          <GitBranch />
          <span className="sr-only">Github Repo</span>
        </Button>
      </Link>
    </header>
  );
}
