export default function DarkModeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium transition hover:opacity-90"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
