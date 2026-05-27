export function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-blush">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-[spin_1s_linear_infinite] rounded-full border-4 border-blush-200 border-t-blush-500" />
        </div>
        <p className="font-display text-2xl text-blush-700">Short Kurti</p>
        <p className="text-xs uppercase tracking-[0.4em] text-blush-700/70">
          loading grace…
        </p>
      </div>
    </div>
  );
}
