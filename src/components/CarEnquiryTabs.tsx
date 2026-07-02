"use client";

import { useState } from "react";
import { MessageSquare, Repeat } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import PartExchangeForm from "./PartExchangeForm";
import { cn } from "@/lib/utils";

export default function CarEnquiryTabs({
  carId,
  carTitle,
}: {
  carId: string;
  carTitle: string;
}) {
  const [tab, setTab] = useState<"enquire" | "px">("enquire");

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1">
        <TabButton active={tab === "enquire"} onClick={() => setTab("enquire")}>
          <MessageSquare className="h-4 w-4" />
          Enquire
        </TabButton>
        <TabButton active={tab === "px"} onClick={() => setTab("px")}>
          <Repeat className="h-4 w-4" />
          Part exchange
        </TabButton>
      </div>

      {tab === "enquire" ? (
        <EnquiryForm carId={carId} carTitle={carTitle} compact />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-500">
            Got a car to trade in against this one? Add its details and
            we&apos;ll include a part-exchange valuation.
          </p>
          <PartExchangeForm carId={carId} carTitle={carTitle} compact />
        </>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
        active
          ? "bg-white text-ink-950 shadow-sm"
          : "text-ink-500 hover:text-ink-900",
      )}
    >
      {children}
    </button>
  );
}
