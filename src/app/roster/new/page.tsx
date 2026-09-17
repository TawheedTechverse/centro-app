import { RosterForm } from "@/components/roster-form";

export const metadata = { title: "Create Roster | Centro" };

export default function CreateRosterPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <RosterForm />
    </div>
  );
}
