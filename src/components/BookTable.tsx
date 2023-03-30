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
} from "@tanstack/solid-table";
import {createSignal, For, Show} from "solid-js";
import type {IRepo, IRepoBook} from "src/customTypes";
import {ChapterTable} from "./ChapterTable";
import {RowActions} from "./RowActions";
import {TableRow} from "./TableRow";
import {Icon} from "./Icon";

type IBookTable = {
  data: IRepo;
};
export function BookTable(props: IBookTable) {
  const [data, setData] = createSignal(Object.values(props.data));
  console.log(data());
  const [openNestedRows, setOpenNestedRows] = createSignal([]);
  const [sorting, setSorting] = createSignal<SortingState>([]);

  const columnHelper = createColumnHelper<IRepoBook>();
  const columns = [
    // columnHelper.display({
    //   id: "actions",
    //   cell: (props) => (
    //     <RowActions
    //       row={props.row}
    //       setOpenNestedRows={setOpenNestedRows}
    //       openNestedRows={openNestedRows}
    //     />
    //   ),
    // }),
    // columnHelper.accessor("name", {
    //   cell: ({row, getValue}) => (
    //     <div
    //       style={{
    //         // Since rows are flattened by default,
    //         // we can use the row.depth property
    //         // and paddingLeft to visually indicate the depth
    //         // of the row
    //         "padding-left": `${row.depth * 2}rem`,
    //       }}
    //     >
    //       <>
    //         {row.getCanExpand() ? (
    //           <button
    //             {...{
    //               onClick: row.getToggleExpandedHandler(),
    //               style: {cursor: "pointer"},
    //             }}
    //           >
    //             {row.getIsExpanded() ? "👇" : "👉"}
    //           </button>
    //         ) : (
    //           "🔵"
    //         )}{" "}
    //         {getValue()}
    //       </>
    //     </div>
    //   ),

    //   header: "Text",
    // }),
    columnHelper.accessor("name", {
      cell: (book) => {
        return book.row.getCanExpand() ? (
          <button
            onClick={book.row.getToggleExpandedHandler()}
            class="cursor-pointer inline-flex items-center gap-1"
          >
            {book.row.getIsExpanded() ? (
              <Icon className="i-mdi-arrow-down-bold" text={book.getValue()} />
            ) : (
              <Icon className="i-mdi-arrow-right-bold" text={book.getValue()} />
            )}
          </button>
        ) : (
          book.getValue()
        );
      },
      header: "Book Name",
    }),
    columnHelper.accessor("totalLineCount", {
      cell: (book) => Number(book.getValue()),
      header: "Book Line Count",
      // invertSorting: true,
    }),
  ];
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
    getRowCanExpand: () => true,
    columns: columns,
    debugTable: true,
  });

  const renderChaptersTable = (props) => {
    return <ChapterTable row={props.row} />;
  };

  return (
    <div class="w-full mx-auto">
      <table class="w-full">
        <thead class="m-0  border-b border-b-black bg-grey-300 w-full">
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
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>
                      {renderChaptersTable({row})}
                    </td>
                  </tr>
                )}
              </>
            )}
          </For>
        </tbody>
      </table>
      <div class="h-4" />
    </div>
  );
}
