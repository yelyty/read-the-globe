const TOTAL_COUNTRIES = 195;

type ProgressParProps = {
  countriesCount: number;
};

const ProgressBar = ({ countriesCount }: ProgressParProps) => {
  const progress = Math.round((countriesCount / TOTAL_COUNTRIES) * 100);

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-header">
        <span className="primary emphasized">{countriesCount}</span>
        <span className="secondary"> / {TOTAL_COUNTRIES} countries</span>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
