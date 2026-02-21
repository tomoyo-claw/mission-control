"use client";

import { useState, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useMockData, Note } from '@/lib/mock-data';

export default function MemoryPage() {
  const { notes, createNote, updateNote, deleteNote, users } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
  });

  // Edit form state
  const [editNote, setEditNote] = useState({
    title: '',
    content: '',
    tags: '',
  });

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter notes based on search and tag
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || note.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [notes, searchTerm, selectedTag]);

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    createNote({
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdBy: '1', // Default user for demo
    });

    setNewNote({ title: '', content: '', tags: '' });
    setShowNewNoteForm(false);
  };

  const handleUpdateNote = () => {
    if (!selectedNote || !editNote.title.trim() || !editNote.content.trim()) return;

    updateNote(selectedNote._id, {
      title: editNote.title,
      content: editNote.content,
      tags: editNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });

    setIsEditing(false);
    // Update selectedNote to reflect changes
    const updatedNote = {
      ...selectedNote,
      title: editNote.title,
      content: editNote.content,
      tags: editNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    setSelectedNote(updatedNote);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
    });
    setIsEditing(true);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    if (selectedNote && selectedNote._id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">メモリ画面</h1>
        <p className="text-gray-400">ノート、検索、ナレッジベース</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Notes List */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-700 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ノートを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-2 py-1 text-xs rounded ${
                  selectedTag === '' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                すべて
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* New Note Button */}
            <button
              onClick={() => setShowNewNoteForm(true)}
              className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              新しいノート
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotes.map(note => {
              const author = users.find(u => u._id === note.createdBy);
              return (
                <div
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedNote?._id === note._id
                      ? 'border-blue-500 bg-blue-900'
                      : 'border-gray-600 bg-gray-700 hover:bg-gray-650'
                  }`}
                >
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{note.title}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-purple-600 text-purple-100 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {author?.name || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>ノートが見つかりません</p>
              </div>
            )}
          </div>
        </div>

        {/* Note Content */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{selectedNote.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {users.find(u => u._id === selectedNote.createdBy)?.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      更新: {formatDate(selectedNote.updatedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditNote(selectedNote)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(selectedNote._id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="ノートタイトル"
                    />
                    <input
                      type="text"
                      value={editNote.tags}
                      onChange={(e) => setEditNote({ ...editNote, tags: e.target.value })}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="タグ (カンマ区切り)"
                    />
                    <textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="Markdownで記述..."
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleUpdateNote}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedNote.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center px-2 py-1 bg-purple-600 text-purple-100 text-sm rounded"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-white">{children}</h3>,
                          p: ({ children }) => <p className="mb-4 text-gray-200 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-200">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-200">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-green-400 text-sm">{children}</code>,
                          pre: ({ children }) => <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-4">{children}</blockquote>,
                        }}
                      >
                        {selectedNote.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : showNewNoteForm ? (
            /* New Note Form */
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">新しいノート</h2>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ノートタイトル"
              />
              <input
                type="text"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="タグ (カンマ区切り)"
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Markdownで記述..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewNoteForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  作成
                </button>
              </div>
            </div>
          ) : (
            /* No Note Selected */
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">ノートを選択してください</p>
                <p className="text-sm">左側のリストからノートを選択するか、新しいノートを作成してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}