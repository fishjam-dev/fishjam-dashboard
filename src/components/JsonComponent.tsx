export const JsonComponent = ({ state }: { state: unknown }) => {
  const customStringify = (obj: unknown) => {
    const replacerFunc = (key: string, value: unknown) => {
      if (typeof value === "bigint") return value.toString();
      return value;
    };

    if (Array.isArray(obj)) {
      return obj
        .map((item) => {
          const str = JSON.stringify(item, replacerFunc, 2);
          return str;
        })
        .join("\n");
    } else {
      return JSON.stringify(obj, replacerFunc, 2);
    }
  };

  return (
    <div className="mockup-code m-2">
      <small>
        <pre>
          <code>{customStringify(state)}</code>
        </pre>
      </small>
    </div>
  );
};
