import { Coffee, MapPin, ShoppingBasket } from "lucide-react";

export const metadata = { title: "About | Centro" };

export default function AboutPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="glass-card flex w-full max-w-md flex-col items-center gap-4 rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-bold">Centro Grocer</h1>
        <p className="text-sm font-medium uppercase tracking-widest text-maroon dark:text-maroon-light">
          Manage your Business
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-maroon dark:text-maroon-light" />
          2 Waterview Dr, Lane Cove
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/80">
          <span className="flex items-center gap-1.5">
            <Coffee className="h-4 w-4" /> Coffees
          </span>
          <span className="flex items-center gap-1.5">
            <ShoppingBasket className="h-4 w-4" /> Snacks
          </span>
          <span className="flex items-center gap-1.5">
            <ShoppingBasket className="h-4 w-4" /> Groceries
          </span>
        </div>
      </div>
    </div>
  );
}
