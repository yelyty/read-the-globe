type TextInputProps = React.ComponentPropsWithoutRef<"input"> & {
  error?: string;
};

const TextInput = ({ className, error, ...props }: TextInputProps) => {
  return (
    <>
      <input
        className={`${"input"}${className ? ` ${className}` : ""}`}
        {...props}
      />
      {error && <span className={error}>{error}</span>}
    </>
  );
};

export default TextInput;
