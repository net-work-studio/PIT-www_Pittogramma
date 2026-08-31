"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  type MouseEvent,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type ResourceListSortColumn,
  type ResourceListSortState,
  sortResourceListItems,
} from "@/lib/resource-list-sort";
import type { DESIGNERS_QUERY_RESULT } from "@/sanity/types";
import DesignerModal from "./designer-modal";
import DesignerPortraitThumb from "./designer-portrait-thumb";
import DesignerProjectLink from "./designer-project-link";

type Designer = DESIGNERS_QUERY_RESULT[number];

interface DesignerListColumn extends ResourceListSortColumn<Designer> {
  className: string;
  label: string;
}

const projectTitleCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function getFirstProjectTitle(designer: Designer) {
  return designer.projects?.reduce<string | undefined>(
    (firstTitle, project) => {
      const { title } = project;
      if (!title) {
        return firstTitle;
      }

      return !firstTitle || projectTitleCollator.compare(title, firstTitle) < 0
        ? title
        : firstTitle;
    },
    undefined
  );
}

const DESIGNER_LIST_COLUMNS: DesignerListColumn[] = [
  {
    className: "col-span-3",
    getSortValue: (designer) => designer.name,
    id: "designer",
    label: "Designer",
  },
  {
    className: "col-span-4",
    getSortValue: getFirstProjectTitle,
    id: "projects",
    label: "Projects",
  },
  {
    className: "col-span-2",
    getSortValue: (designer) => designer.place?.city,
    id: "city",
    label: "City",
  },
  {
    className: "col-span-2",
    getSortValue: (designer) => designer.place?.country,
    id: "country",
    label: "Country",
  },
  {
    className: "col-span-1",
    getSortValue: (designer) => designer.birthYear,
    id: "year",
    label: "Year",
  },
];

function clearDesignerSearchParam(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("designer");
  const qs = params.toString();
  window.history.replaceState(null, "", `/designers${qs ? `?${qs}` : ""}`);
}

function DesignerListItem({
  designer,
  defaultOpen,
  onOpenChange,
  ref,
}: {
  designer: Designer;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      className="grid w-full grid-cols-12 items-start gap-2.5 border-b px-2.5 py-3 text-left transition-colors duration-75 ease-in-out hover:bg-muted max-md:grid-cols-1 max-md:gap-1"
      ref={ref}
    >
      <div className="col-span-3 max-md:col-span-1">
        <DesignerModal
          defaultOpen={defaultOpen}
          designer={designer}
          onOpenChange={onOpenChange}
        >
          <button
            className="inline-flex max-w-full items-center gap-2 transition-colors hover:text-muted-foreground"
            type="button"
          >
            <DesignerPortraitThumb
              name={designer.name}
              portrait={designer.portrait}
            />
            <span className="min-w-0 truncate max-md:font-medium">
              {designer.name}
            </span>
          </button>
        </DesignerModal>
      </div>

      <div className="col-span-4 max-md:col-span-1 max-md:pl-9 max-md:text-muted-foreground max-md:text-sm">
        {designer.projects?.length ? (
          <div className="flex flex-col gap-2">
            {designer.projects.map((project) => (
              <DesignerProjectLink key={project._id} project={project} />
            ))}
          </div>
        ) : (
          "-"
        )}
      </div>

      <span className="col-span-2 max-md:hidden">
        {designer.place?.city || "-"}
      </span>
      <span className="col-span-2 max-md:hidden">
        {designer.place?.country || "-"}
      </span>
      <span className="col-span-1 max-md:hidden">
        {designer.birthYear || "-"}
      </span>
    </div>
  );
}

interface DesignerListProps {
  designers: DESIGNERS_QUERY_RESULT;
}

export default function DesignerList({ designers }: DesignerListProps) {
  const searchParams = useSearchParams();
  const urlSlug = searchParams.get("designer");
  const [openSlug, setOpenSlug] = useState<string | null>(urlSlug);
  const [sort, setSort] = useState<ResourceListSortState | null>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);
  const sortedDesigners = useMemo(
    () => sortResourceListItems(designers, DESIGNER_LIST_COLUMNS, sort),
    [designers, sort]
  );

  useEffect(() => {
    setOpenSlug(urlSlug);
  }, [urlSlug]);

  useEffect(() => {
    if (urlSlug && !designers.some((d) => d.slug?.current === urlSlug)) {
      clearDesignerSearchParam(searchParams);
      setOpenSlug(null);
    }
  }, [urlSlug, designers, searchParams]);

  useEffect(() => {
    if (openSlug) {
      activeRowRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [openSlug]);

  const handleModalClose = useCallback(() => {
    setOpenSlug(null);
    clearDesignerSearchParam(searchParams);
  }, [searchParams]);

  const handleSort = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const { columnId } = event.currentTarget.dataset;

    if (!columnId) {
      return;
    }

    setSort((currentSort) => ({
      columnId,
      direction:
        currentSort?.columnId === columnId && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  return (
    <section>
      <ul className="grid grid-cols-12 gap-2.5 border-b px-2.5 pb-2 font-mono text-xs uppercase max-md:hidden">
        {DESIGNER_LIST_COLUMNS.map((column) => {
          const isActive = sort?.columnId === column.id;
          const sortDirection = isActive ? sort?.direction : undefined;
          const SortIcon =
            sortDirection === "asc" ? ArrowUpIcon : ArrowDownIcon;

          return (
            <li className={column.className} key={column.id}>
              <button
                aria-label={`Sort by ${column.label}${sortDirection ? `, ${sortDirection === "asc" ? "ascending" : "descending"}` : ""}`}
                aria-pressed={isActive}
                className="inline-flex w-full cursor-pointer items-center gap-1 text-left text-muted-foreground uppercase"
                data-column-id={column.id}
                onClick={handleSort}
                type="button"
              >
                {column.label}
                {isActive && <SortIcon aria-hidden="true" className="size-3" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div>
        {sortedDesigners.map((designer) => {
          const isActive = designer.slug?.current === openSlug;
          return (
            <DesignerListItem
              defaultOpen={isActive}
              designer={designer}
              key={designer._id}
              onOpenChange={
                isActive
                  ? (open) => {
                      if (!open) {
                        handleModalClose();
                      }
                    }
                  : undefined
              }
              ref={isActive ? activeRowRef : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
