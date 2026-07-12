import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink text-white gap-3">
      <p className="font-display text-5xl font-semibold text-signal">404</p>
      <p className="text-fog">This route doesn't exist.</p>
      <Link to="/" className="text-signal-dark font-medium mt-2">Back to dashboard</Link>
    </div>
  );
}
