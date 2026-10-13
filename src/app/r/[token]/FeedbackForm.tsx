"use client";

import { useState } from "react";

interface FeedbackFormProps {
    token: string;
    ratingScale: "csat_5" | "nps_11";
    questionText: string;
}

export default function FeedbackForm({ token, ratingScale, questionText }: FeedbackFormProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const maxRating = ratingScale === "nps_11" ? 10 : 5;
    const ratingOptions = Array.from({ length: maxRating + (ratingScale === "nps_11" ? 1 : 0) }, (_, i) =>
        ratingScale === "nps_11" ? i : i + 1,
    );

    const submit = async () => {
        if (rating === null || submitting) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/call-feedback/${token}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment }),
            });
            const data = await res.json();
            if (data?.statusCode === 200) {
                setSubmitted(true);
            } else {
                setError(data?.message || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <Shell>
                <h1 className="text-lg font-semibold text-heading">Thank you!</h1>
                <p className="mt-2 text-sm text-txt-primary">Your feedback helps us improve.</p>
            </Shell>
        );
    }

    return (
        <Shell>
            <h1 className="text-lg font-semibold text-heading">{questionText}</h1>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {ratingOptions.map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                            rating === value
                                ? "border-primary bg-primary text-white"
                                : "border-dark-700 text-heading hover:border-primary"
                        }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-txt-secondary">
                <span>{ratingScale === "nps_11" ? "Not likely" : "Poor"}</span>
                <span>{ratingScale === "nps_11" ? "Very likely" : "Excellent"}</span>
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="Anything else you'd like to share? (optional)"
                rows={3}
                maxLength={500}
                className="mt-5 w-full resize-none rounded-lg border border-dark-700 p-3 text-sm outline-none focus:border-primary"
            />

            {error && <p className="mt-2 text-xs text-error">{error}</p>}

            <button
                type="button"
                onClick={submit}
                disabled={rating === null || submitting}
                className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-medium text-white disabled:opacity-40"
            >
                {submitting ? "Submitting..." : "Submit feedback"}
            </button>
        </Shell>
    );
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-main-background px-6 py-10">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-box">{children}</div>
        </div>
    );
}
