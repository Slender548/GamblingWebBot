import "./Error.css";

export default function ServerError() {
  return (
    <div className="error">
      <h1 className="error-message">500</h1>
      <p className="error-message">Server error</p>
    </div>
  );
}
