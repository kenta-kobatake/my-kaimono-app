'use client';

import { useState, useEffect } from 'react';
import { ShoppingItem } from '@/types/shopping';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [productName, setProductName] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);

  // ページ読み込み時にデータを取得
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productName.trim() && shopName.trim()) {
      try {
        const { data, error } = await supabase
          .from('shopping_items')
          .insert({
            product_name: productName.trim(),
            shop_name: shopName.trim(),
            completed: false,
          })
          .select()
          .single();

        if (error) throw error;
        setItems([data, ...items]);
        setProductName('');
        setShopName('');
      } catch (error) {
        console.error('データの追加に失敗しました:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('このアイテムを削除しますか？')) {
      try {
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error('データの削除に失敗しました:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('すべてのアイテムを削除しますか？この操作は取り消せません。')) {
      try {
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // 全削除のため存在しないIDと比較

        if (error) throw error;
        setItems([]);
      } catch (error) {
        console.error('データの全削除に失敗しました:', error);
      }
    }
  };

  const handleToggleComplete = async (id: string) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ completed: !item.completed })
        .eq('id', id);

      if (error) throw error;
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    } catch (error) {
      console.error('データの更新に失敗しました:', error);
    }
  };

  const completedCount = items.filter((item) => item.completed).length;
  const remainingCount = items.length - completedCount;

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          買い物アプリ
        </h1>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                商品名
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="商品名を入力してください"
              />
            </div>
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                ショップ名
              </label>
              <input
                type="text"
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="ショップ名を入力してください"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              追加
            </button>
          </div>
        </form>

        {/* 一覧表示 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                買い物リスト ({items.length})
              </h2>
              {items.length > 0 && (
                <p className="text-sm text-white/80">
                  未完了: {remainingCount} / 完了: {completedCount}
                </p>
              )}
            </div>
            {items.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md transition-colors duration-200"
              >
                すべて削除
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
              買い物アイテムがありません。上記のフォームから追加してください。
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 ${
                    item.completed ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleComplete(item.id)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold mb-2 ${
                            item.completed
                              ? 'text-gray-400 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {item.product_name}
                        </h3>
                        <p
                          className={`text-sm ${
                            item.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <span className="font-medium">ショップ:</span> {item.shop_name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
