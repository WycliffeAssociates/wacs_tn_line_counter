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
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import {unified} from "unified";
import {createMemo, createSignal, For, Show} from "solid-js";
import type {
  IRepo,
  IRepoBook,
  IRepoBucket,
  IRepoChapter,
  IRepoVerse,
  ITableBetterEntry,
} from "src/customTypes";
import {TableRow} from "./TableRow";
import {NestedTable} from "./NestedTable";
import {Icon} from "./Icon";
import {setHtmlPreview} from "./SharedSignals";

type VerseTableProps = {
  verseList: IRepoVerse[];
  colsByRepoBranch: IRepoBucket;
  chapNum: string;
  bookName: string;
};

export function VerseTable(props: VerseTableProps) {
  const [data, setData] = createSignal(Object.values(props.verseList));
  const [sorting, setSorting] = createSignal<SortingState>([]);
  // the changing columns seems to reset expanded state, so manually track rows here
  const [expandedRows, setExpandedRows] = createSignal<string[]>([]);

  const columnHelper = createColumnHelper<IRepoVerse>();
  const addlCols = createMemo(() => {
    const arr = props.colsByRepoBranch.map((repo) => {
      return columnHelper.group({
        header: repo.repoName,
        columns: repo.branches.map((branch) => {
          return columnHelper.accessor(
            (verseRow) => {
              debugger;
              const mb = branch.data.find(
                (book) =>
                  book.name.toUpperCase() == props.bookName.toUpperCase()
              );
              const mc =
                mb && mb.chapters.find((chap) => chap.chapNum == props.chapNum);

              const matchingVerse =
                mc &&
                mc.verses.find((verse) => verse.verseNum == verseRow.verseNum);
              return matchingVerse?.verseLineCount;
            },
            {
              header: branch.branchName,
              id: `${repo.repoName}-${branch.branchName}`,
            }
          );
        }),
      });
    });
    return arr;
  });
  const columns = [
    columnHelper.accessor("verseNum", {
      cell: (verse) => {
        return verse.row.getCanExpand() ? (
          <button
            onClick={() => {
              // add if not present in arr of expandeds, or remove if so.
              if (expandedRows().includes(verse.row.id)) {
                setExpandedRows(
                  expandedRows().filter((row) => row != verse.row.id)
                );
              } else {
                setExpandedRows((prev) => [...prev, verse.row.id]);
              }
            }}
            class="cursor-pointer inline-flex items-center gap-1"
          >
            {expandedRows().includes(verse.row.id) ? (
              <Icon className="i-mdi-arrow-down-bold" text={verse.getValue()} />
            ) : (
              <Icon
                className="i-mdi-arrow-right-bold"
                text={verse.getValue()}
              />
            )}
          </button>
        ) : (
          verse.getValue()
        );
      },
      header: "Chapter Number",
    }),
    ...addlCols(),
  ];
  const table = () =>
    createSolidTable({
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
      getRowCanExpand: () => true,
      columns: columns,
      // debugTable: true,
    });

  return (
    <div class="w-full pl-4">
      <table class="w-full">
        <thead class="m-0  border-b border-b-black">
          <For each={table().getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="pr-4  bg-gray-300" colSpan={header.colSpan}>
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
          <For each={table().getRowModel().rows}>
            {(row) => (
              <>
                <TableRow row={row} />
              </>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
