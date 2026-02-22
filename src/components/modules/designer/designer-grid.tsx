"use client";

import { useState } from "react";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerCard from "./designer-card";
import DesignerPreviewDialog from "./designer-preview-dialog";

type Designer = DESIGNERS_QUERY_RESULT[number];

interface DesignerGridProps {
  designers: DESIGNERS_QUERY_RESULT;
}

export default function DesignerGrid({ designers }: DesignerGridProps) {
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="grid grid-cols-4 gap-2.5">
        {designers.map((designer: Designer) => (
          <DesignerCard
            designer={designer}
            key={designer._id}
            onClick={() => {
              setSelectedDesigner(designer);
              setDialogOpen(true);
            }}
          />
        ))}
      </section>
      <DesignerPreviewDialog
        designer={selectedDesigner}
        onOpenChange={setDialogOpen}
        open={dialogOpen}
      />
    </>
  );
}
