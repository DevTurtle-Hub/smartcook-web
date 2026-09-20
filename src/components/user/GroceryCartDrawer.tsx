import React from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Store, 
  Sparkles, 
  Plus, 
  Minus,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const GroceryCartDrawer: React.FC = () => {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    removeItem, 
    toggleItemCheck, 
    clearCart,
    getTotalPrice 
  } = useCartStore();

  if (!isCartOpen) return null;

  // Gom nhóm nguyên liệu theo món ăn để trực quan
  const groupedByRecipe: Record<string, typeof items> = {};
  items.forEach((item) => {
    const key = item.recipeTitle || 'Nguyên liệu khác';
    if (!groupedByRecipe[key]) groupedByRecipe[key] = [];
    groupedByRecipe[key].push(item);
  });

  const totalPrice = getTotalPrice();
  const checkedCount = items.filter((i) => i.checked).length;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-hidden">
      {/* Backdrop mờ tối ưu */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 h-screen">
        <div className="w-screen max-w-md sm:max-w-lg h-full max-h-screen bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-orange-100 relative z-10">
          
          {/* HEADER GIỎ HÀNG */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    Giỏ Hàng Đi Chợ
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black">
                    {items.length} món
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đã chọn {checkedCount}/{items.length} nguyên liệu cần mua
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Xóa tất cả"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DANH SÁCH MÓN ĂN & NGUYÊN LIỆU TRONG GIỎ HÀNG */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Giỏ đi chợ đang trống</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Hãy vào xem chi tiết các món ăn và bấm nút <b>"+ Thêm vào giỏ"</b> ở từng nguyên liệu còn thiếu trong tủ lạnh nhé!
                </p>
              </div>
            ) : (
              Object.entries(groupedByRecipe).map(([recipeTitle, groupItems]) => (
                <div key={recipeTitle} className="space-y-3">
                  {/* Nhãn Tên Món Ăn Đi Kèm */}
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <Store className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Món: {recipeTitle}
                    </span>
                  </div>

                  {/* Danh sách từng nguyên liệu của món */}
                  <div className="space-y-2">
                    {groupItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          item.checked
                            ? 'bg-white border-slate-200/80 shadow-2xs hover:border-orange-200'
                            : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                        }`}
                      >
                        {/* Checkbox & Tên */}
                        <div 
                          onClick={() => toggleItemCheck(item.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-2"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-xs sm:text-sm font-bold truncate ${item.checked ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                              {item.name}
                            </h5>
                            <span className="text-[11px] text-slate-400 block truncate">
                              Định lượng: {item.amount} {item.unit} {item.notes && `• ${item.notes}`}
                            </span>
                          </div>
                        </div>

                        {/* Đơn giá & Nút Xóa */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs sm:text-sm font-black text-orange-600">
                            {item.price.toLocaleString('vi-VN')} đ
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                            title="Bỏ nguyên liệu này"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER TỔNG TIỀN VÀ NÚT ĐẶT HÀNG / ĐI CHỢ */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 space-y-4">
              
              {/* Chi tiết ước tính thanh toán */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tổng số nguyên liệu chọn:</span>
                  <span className="font-bold text-slate-800">{checkedCount} món</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Ước tính giá siêu thị gần bạn:</span>
                  <span className="text-emerald-600 font-bold">Giá tốt nhất</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">Tổng tiền ước tính:</span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-orange-600 font-heading">
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút Đi Chợ / Đặt Hàng Tức Thì */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(`Đã lưu danh sách ${checkedCount} nguyên liệu đi chợ (${totalPrice.toLocaleString('vi-VN')} đ). Bạn có thể mở app SmartCook trên điện thoại để đồng bộ siêu thị giao tận nhà!`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>TIẾN HÀNH ĐI CHỢ NGAY</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Đồng bộ tự động với WinMart, Co.opmart & Bách Hóa Xanh</span>
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};
