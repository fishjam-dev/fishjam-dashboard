export const JsonComponent = ({ state }: { state: unknown }) => {
  return (
    <div className="mockup-code m-2">
      <small>
        <pre>
          <code>
            {JSON.stringify(
              state,
              (key, value) => {
                if (typeof value === "bigint") return value.toString();
                return value;
              },
              2,
            )}
          </code>
        </pre>
      </small>
    </div>
  );
};
