import type {Row} from "@tanstack/solid-table";
import type {Accessor, Setter} from "solid-js";
import type {IRepoBook} from "src/customTypes";

type RowActionsProps = {
  row: Row<IRepoBook>;
  openNestedRows: Accessor<string[]>;
  setOpenNestedRows: Setter<string[]>;
};
export function RowActions(props: RowActionsProps) {
  return (
    <button
      onClick={() => {
        if (props.openNestedRows().includes(props.row.id)) {
          props.setOpenNestedRows(
            props.openNestedRows().filter((id) => id != props.row.id)
          );
        } else {
          props.setOpenNestedRows([props.row.id, ...props.openNestedRows()]);
        }
      }}
    >
      +
    </button>
  );
}
