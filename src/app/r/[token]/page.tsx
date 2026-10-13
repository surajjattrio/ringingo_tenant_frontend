import FeedbackForm from "./FeedbackForm";

type FeedbackState =
  | { state: "not_found" }
  | { state: "already_submitted" }
  | { state: "ok"; token: string; ratingScale: "csat_5" | "nps_11"; questionText: string };

async function getFeedbackState(token: string): Promise<FeedbackState> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/call-feedback/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return { state: "not_found" };
    return await res.json();
  } catch {
    return { state: "not_found" };
  }
}

function FriendlyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-main-background px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-box">
        <h1 className="text-lg font-semibold text-heading">{title}</h1>
        <p className="mt-2 text-sm text-txt-primary">{body}</p>
      </div>
    </div>
  );
}

export default async function FeedbackPage({ params }: { params: { token: string } }) {
  const data = await getFeedbackState(params.token);

  if (data.state === "not_found") {
    return <FriendlyState title="Link not found" body="This feedback link isn't valid. If you think this is a mistake, please contact us." />;
  }

  if (data.state === "already_submitted") {
    return <FriendlyState title="Already submitted" body="You've already shared your feedback for this call. Thank you!" />;
  }

  return (
    <FeedbackForm token={data.token} ratingScale={data.ratingScale} questionText={data.questionText} />
  );
}
