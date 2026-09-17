import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RosterEditForm } from "@/components/roster-edit-form";

export const metadata = { title: "Edit Shift | Centro" };

export default async function EditRosterPage(props: PageProps<"/roster/[id]/edit">) {
  const { id } = await props.params;
  const roster = await prisma.roster.findUnique({ where: { id } });

  if (!roster) notFound();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <RosterEditForm roster={roster} />
    </div>
  );
}
