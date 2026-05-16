const TOTAL_COUNTRIES = 195;

type ProgressParProps = {
  countriesCount: number;
};

const ProgressBar = ({ countriesCount }: ProgressParProps) => {
  const progress = Math.round((countriesCount / TOTAL_COUNTRIES) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        backgroundColor: "var(--card)",
        borderRadius: "12px",
        padding: "16px 24px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {countriesCount}{" "}
            <span
              style={{
                color: "grey",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              / {TOTAL_COUNTRIES} countries
            </span>
          </span>

          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "gray",
            }}
          >
            {progress}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            backgroundColor: "gray",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "pink",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
