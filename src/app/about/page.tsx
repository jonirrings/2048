import type { PageProps, Metadata } from "rari";

export default function AboutPage(_params: PageProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-[#776e65] mb-4">About 2048</h1>
        <p className="text-gray-600 mb-4">
          2048 is a popular sliding tile puzzle game. Join the numbers and get to the 2048 tile!
        </p>

        <h2 className="text-xl font-semibold text-[#776e65] mt-6 mb-3">How to Play</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move tiles
          </li>
          <li>
            Connect a <strong>gamepad</strong> and use D-pad or left stick
          </li>
          <li>
            On mobile, <strong>swipe</strong> to move tiles
          </li>
          <li>
            Enable <strong>tilt control</strong> in settings to use device orientation
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[#776e65] mt-6 mb-3">Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Four animation modes: DOM, SVG, WebGL, WebGPU</li>
          <li>Desktop and mobile support</li>
          <li>Gamepad and touch controls</li>
          <li>Haptic feedback on mobile and gamepad</li>
          <li>Score tracking with local storage</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#776e65] mt-6 mb-3">Animation Modes</h2>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="bg-[#faf8ef] p-3 rounded-md">
            <h3 className="font-semibold text-[#776e65]">DOM</h3>
            <p className="text-sm text-gray-500">CSS transitions</p>
          </div>
          <div className="bg-[#faf8ef] p-3 rounded-md">
            <h3 className="font-semibold text-[#776e65]">SVG</h3>
            <p className="text-sm text-gray-500">Vector graphics</p>
          </div>
          <div className="bg-[#faf8ef] p-3 rounded-md">
            <h3 className="font-semibold text-[#776e65]">WebGL</h3>
            <p className="text-sm text-gray-500">GPU rendering</p>
          </div>
          <div className="bg-[#faf8ef] p-3 rounded-md">
            <h3 className="font-semibold text-[#776e65]">WebGPU</h3>
            <p className="text-sm text-gray-500">Next-gen GPU</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="inline-block bg-[#8f7a66] text-white font-bold py-2 px-4 rounded-md hover:bg-[#7f6a56] transition-colors"
          >
            Play Now
          </a>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "About | 2048 Game",
  description: "Learn how to play 2048 and about its features",
};
