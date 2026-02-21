import AudioRecorder from "../components/AudioRecorder";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <h1 className="text-4xl font-bold text-white mb-8">CheatCode AI</h1>
      <AudioRecorder />
    </main>
  );
}