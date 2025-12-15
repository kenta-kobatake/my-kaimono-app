'use client';

import { useState } from 'react';
import { ShoppingItem } from '@/types/shopping';

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [productName, setProductName] = useState('');
  const [shopName, setShopName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productName.trim() && shopName.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        productName: productName.trim(),
        shopName: shopName.trim(),
      };
      setItems([...items, newItem]);
      setProductName('');
      setShopName('');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('このアイテムを削除しますか？')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleDeleteAll = () => {
    if (confirm('すべてのアイテムを削除しますか？この操作は取り消せません。')) {
      setItems([]);
    }
  };

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
            <h2 className="text-2xl font-bold text-white">
              買い物リスト ({items.length})
            </h2>
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
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex flex-col">
                    <div className="flex-1 mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">ショップ:</span> {item.shopName}
                      </p>
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
