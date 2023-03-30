import {
  flexRender,
  getCoreRowModel,
  ColumnDef,
  createSolidTable,
  createColumnHelper,
  SortingState,
  getSortedRowModel,
  ExpandedState,
  getExpandedRowModel,
  Row,
} from "@tanstack/solid-table";
import {createSignal, For, JSXElement, Show} from "solid-js";
import type {IRepo, IRepoBook, IRepoChapter, IRepoVerse} from "src/customTypes";
import {TableRow} from "./TableRow";

type ChapterTableProps = {
  row: Row<IRepoBook> | Row<IRepoChapter> | Row<unknown>;
  data?: IRepoBook[] | IRepoChapter[] | IRepoVerse[] | null;
  columns?: any[];
  subComponent?: JSXElement;
  rowCanExpand: () => boolean;
  bucket?: IRepoBook | IRepoChapter | IRepoVerse;
};
export function NestedTable(props: ChapterTableProps) {
  const defData = props.data || {};
  const [data, setData] = createSignal(Object.values(defData));
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const columnHelper =
    props.bucket?.level === "book"
      ? createColumnHelper<IRepoBook>()
      : props.bucket?.level == "chapter"
      ? createColumnHelper<IRepoChapter>()
      : props.bucket?.level == "verse"
      ? createColumnHelper<IRepoVerse>()
      : null;
  if (!columnHelper) return;

  const table = createSolidTable({
    get data() {
      return data();
    },
    state: {
      get sorting() {
        return sorting();
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => props.rowCanExpand(),
    columns: props.columns || [],
    // debugTable: true,
  });

  return (
    <div class="w-full pl-4">
      <table class="w-full">
        <thead class="m-0  border-b border-b-black">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="pr-4  bg-gray-300">
                      <Show when={!header.isPlaceholder}>
                        <div
                          class={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <>
                <TableRow row={row} />
                <Show when={row.getCanExpand()}>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        {NestedTable({
                          columns: [],
                          row: row,
                          rowCanExpand: () => false,
                        })}
                      </td>
                    </tr>
                  )}
                </Show>
              </>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
