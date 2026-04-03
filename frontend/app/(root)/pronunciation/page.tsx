import PronunciationClient from "./PronunciationClient";

export default function PronunciationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100 dark:from-zinc-950 dark:to-zinc-900 p-6">
            <PronunciationClient />
        </div>
    );
}