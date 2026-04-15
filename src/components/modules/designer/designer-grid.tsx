"use client";

import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerCard from "./designer-card";
import DesignerModal from "./designer-modal";

interface DesignerGridProps {
  designers: DESIGNERS_QUERY_RESULT;
}

export default function DesignerGrid({ designers }: DesignerGridProps) {
  return (
    <section className="grid grid-cols-4 gap-2.5">
      {designers.map((designer) => (
        <DesignerModal designer={designer} key={designer._id}>
          <DesignerCard designer={designer} />
        </DesignerModal>
      ))}
    </section>
  );
}
