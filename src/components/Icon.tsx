type IconProps = {
  className: string | string[];
  text?: string;
};
export function Icon(props: IconProps) {
  const cn = Array.isArray(props.className)
    ? props.className.join(" ")
    : props.className;
  return (
    <>
      <span class={cn} />
      {props.text && props.text}
    </>
  );
}
