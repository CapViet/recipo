import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p>Your recipe has been submitted for review. We&apos;ll publish it after approval.</p>
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
