import { useEffect, useState } from 'react';

export interface SavedItem {
  id: string;
  toolId: string;
  title: string;
  content: any;
  savedAt: string;
}

export default function SavedWorkList({ onOpen }: { onOpen?: (item: SavedItem) => void }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selected, setSelected] = useState<SavedItem | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('teacherSavedWorks');
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch (err) {
        console.error('Invalid saved works', err);
      }
    }
  }, []);

  // items are loaded in useEffect; mutations update state directly

  const handleDelete = (id: string) => {
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem('teacherSavedWorks', JSON.stringify(filtered));
    setItems(filtered);
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = () => {
    localStorage.removeItem('teacherSavedWorks');
    setItems([]);
    setSelected(null);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Saved Works</h4>
            <button onClick={clearAll} className="text-sm text-red-500 hover:underline">Clear</button>
          </div>

          {items.length === 0 && <p className="text-gray-400">No saved works yet. Save from any tool.</p>}

          <div className="space-y-2 mt-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="w-full text-left px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-accent hover:text-white transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.toolId} · {new Date(item.savedAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-sm text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-6 min-h-[300px]">
          {!selected && (
            <div className="text-gray-400">
              <div className="text-4xl">💾</div>
              <p className="mt-3">Select a saved work to view its content and metadata.</p>
            </div>
          )}

          {selected && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selected.title}</h3>
                  <div className="text-sm text-gray-500">{selected.toolId} · Saved {new Date(selected.savedAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  {onOpen && (
                    selected.toolId === 'audio-assessment' ? (
                      <button
                        disabled
                        className="text-sm text-gray-500 cursor-not-allowed"
                        title="Audio Assessment tool has been removed"
                      >
                        Open
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpen(selected)}
                        className="text-sm text-accent hover:underline"
                        title="Open in original tool"
                      >
                        Open
                      </button>
                    )
                  )}
                  <button onClick={() => navigator.clipboard.writeText(JSON.stringify(selected.content, null, 2))} className="text-sm text-accent hover:underline">Copy</button>
                  <button onClick={() => { handleDelete(selected.id); }} className="text-sm text-red-400 hover:underline">Delete</button>
                </div>
              </div>

              <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-4 max-h-[600px] overflow-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{typeof selected.content === 'string' ? selected.content : JSON.stringify(selected.content, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
