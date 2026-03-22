import Image from "next/image";

export default function OutputPreview({ prompt }: { prompt: any }) {
  return (
    <section className="bg-[#05060a] border border-white/10 rounded-2xl p-4 sm:p-5">
      <h2 className="text-xs font-medium text-gray-300 mb-3">
        Output Preview
      </h2>
      <div className="relative w-full overflow-hidden rounded-xl bg-black max-h-[420px]">
        {prompt.image ? (
          <Image
            src={prompt.image}
            alt={prompt.title}
            width={1200}
            height={700}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
            No image provided
          </div>
        )}
      </div>
    </section>
  );
}