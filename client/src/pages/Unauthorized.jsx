import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink text-white gap-3">
      <p className="font-display text-5xl font-semibold text-line-stop">403</p>
      <p className="text-fog">Your role doesn't have access to this page.</p>
      <Link to="/" className="text-signal-dark font-medium mt-2">Back to dashboard</Link>
    </div>
  );
}
