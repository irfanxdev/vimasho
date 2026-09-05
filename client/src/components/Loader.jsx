export default function Loader({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-[60vh]' : 'py-12'}`}>
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
