import {createSignal, For, JSX} from "solid-js";

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const ACCORDION_ITEM = classNames(
  "rounded-lg flex items-center justify-between text-left w-full px-4 py-2 text-sm font-medium transition duration-150",
  "focus:outline-none focus-visible:ring focus-visible:ring-opacity-75",
  "focus-visible:ring-gray-900",
  "dark:focus-visible:ring-gray-50",
  "border-2 border-gray-900 dark:border-gray-50",
  // Background
  "bg-gray-900 hover:bg-gray-700 active:bg-gray-800",
  // Foreground
  "text-gray-50 hover:text-gray-200 active:text-gray-100"
);

function ChevronUpIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}

export default function SingleLi(props): JSX.Element {
  console.log({props});
  const [isOpen, setIsOpen] = createSignal(true);
  return (
    <li
      onClick={() => setIsOpen(!isOpen())}
      class={`${isOpen() ? "h-auto" : "h-0 overflow-hidden"} bg-gray-200 my-4`}
    >
      {props.result.name}: {props.result.totalLineCount}
    </li>
  );
}
