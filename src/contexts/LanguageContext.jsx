"use client";

import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Common
    all: "All",
    search: "Search",
    searchProducts: "Search products...",
    categories: "Categories",
    language: "Language",
    currency: "Currency",
    customer: "Customer",

    // Nav
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",

    // User
    signIn: "Sign In",
    signOut: "Sign Out",
    register: "Register",
    dashboard: "Dashboard",
    myOrders: "My Orders",
    wishlist: "Wishlist",
    cart: "Cart",

    // Product
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    price: "Price",
    description: "Description",
    reviews: "Reviews",
    relatedProducts: "Related Products",

    // Cart
    shoppingCart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",

    // Actions
    viewDetails: "View Details",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
  },

  es: {
    // Common
    all: "Todo",
    search: "Buscar",
    searchProducts: "Buscar productos...",
    categories: "Categorías",
    language: "Idioma",
    currency: "Moneda",
    customer: "Cliente",

    // Nav
    home: "Inicio",
    products: "Productos",
    about: "Acerca de",
    contact: "Contacto",

    // User
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    register: "Registrarse",
    dashboard: "Panel",
    myOrders: "Mis Pedidos",
    wishlist: "Lista de Deseos",
    cart: "Carrito",

    // Product
    addToCart: "Agregar al Carrito",
    buyNow: "Comprar Ahora",
    outOfStock: "Agotado",
    inStock: "En Stock",
    price: "Precio",
    description: "Descripción",
    reviews: "Reseñas",
    relatedProducts: "Productos Relacionados",

    // Cart
    shoppingCart: "Carrito de Compras",
    emptyCart: "Tu carrito está vacío",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Finalizar Compra",
    continueShopping: "Continuar Comprando",

    // Actions
    viewDetails: "Ver Detalles",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back: "Atrás",
    next: "Siguiente",
    submit: "Enviar",
  },

  fr: {
    // Common
    all: "Tout",
    search: "Rechercher",
    searchProducts: "Rechercher des produits...",
    categories: "Catégories",
    language: "Langue",
    currency: "Devise",
    customer: "Client",

    // Nav
    home: "Accueil",
    products: "Produits",
    about: "À Propos",
    contact: "Contact",

    // User
    signIn: "Se Connecter",
    signOut: "Se Déconnecter",
    register: "S'inscrire",
    dashboard: "Tableau de Bord",
    myOrders: "Mes Commandes",
    wishlist: "Liste de Souhaits",
    cart: "Panier",

    // Product
    addToCart: "Ajouter au Panier",
    buyNow: "Acheter Maintenant",
    outOfStock: "Rupture de Stock",
    inStock: "En Stock",
    price: "Prix",
    description: "Description",
    reviews: "Avis",
    relatedProducts: "Produits Similaires",

    // Cart
    shoppingCart: "Panier",
    emptyCart: "Votre panier est vide",
    subtotal: "Sous-total",
    total: "Total",
    checkout: "Passer la Commande",
    continueShopping: "Continuer les Achats",

    // Actions
    viewDetails: "Voir Détails",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
  },

  zh: {
    // Common
    all: "全部",
    search: "搜索",
    searchProducts: "搜索产品...",
    categories: "分类",
    language: "语言",
    currency: "货币",
    customer: "客户",

    // Nav
    home: "首页",
    products: "产品",
    about: "关于",
    contact: "联系",

    // User
    signIn: "登录",
    signOut: "登出",
    register: "注册",
    dashboard: "仪表板",
    myOrders: "我的订单",
    wishlist: "愿望清单",
    cart: "购物车",

    // Product
    addToCart: "加入购物车",
    buyNow: "立即购买",
    outOfStock: "缺货",
    inStock: "有货",
    price: "价格",
    description: "描述",
    reviews: "评论",
    relatedProducts: "相关产品",

    // Cart
    shoppingCart: "购物车",
    emptyCart: "您的购物车是空的",
    subtotal: "小计",
    total: "总计",
    checkout: "结账",
    continueShopping: "继续购物",

    // Actions
    viewDetails: "查看详情",
    edit: "编辑",
    delete: "删除",
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    back: "返回",
    next: "下一步",
    submit: "提交",
  },

  ar: {
    // Common
    all: "الكل",
    search: "بحث",
    searchProducts: "البحث عن المنتجات...",
    categories: "الفئات",
    language: "اللغة",
    currency: "العملة",
    customer: "عميل",

    // Nav
    home: "الرئيسية",
    products: "المنتجات",
    about: "من نحن",
    contact: "اتصل بنا",

    // User
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    register: "التسجيل",
    dashboard: "لوحة التحكم",
    myOrders: "طلباتي",
    wishlist: "قائمة الأمنيات",
    cart: "عربة التسوق",

    // Product
    addToCart: "أضف إلى السلة",
    buyNow: "اشتري الآن",
    outOfStock: "غير متوفر",
    inStock: "متوفر",
    price: "السعر",
    description: "الوصف",
    reviews: "التقييمات",
    relatedProducts: "منتجات ذات صلة",

    // Cart
    shoppingCart: "عربة التسوق",
    emptyCart: "عربتك فارغة",
    subtotal: "المجموع الفرعي",
    total: "المجموع",
    checkout: "الدفع",
    continueShopping: "مواصلة التسوق",

    // Actions
    viewDetails: "عرض التفاصيل",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    submit: "إرسال",
  },

  de: {
    // Common
    all: "Alle",
    search: "Suchen",
    searchProducts: "Produkte suchen...",
    categories: "Kategorien",
    language: "Sprache",
    currency: "Währung",
    customer: "Kunde",

    // Nav
    home: "Startseite",
    products: "Produkte",
    about: "Über uns",
    contact: "Kontakt",

    // User
    signIn: "Anmelden",
    signOut: "Abmelden",
    register: "Registrieren",
    dashboard: "Dashboard",
    myOrders: "Meine Bestellungen",
    wishlist: "Wunschliste",
    cart: "Warenkorb",

    // Product
    addToCart: "In den Warenkorb",
    buyNow: "Jetzt kaufen",
    outOfStock: "Ausverkauft",
    inStock: "Auf Lager",
    price: "Preis",
    description: "Beschreibung",
    reviews: "Bewertungen",
    relatedProducts: "Ähnliche Produkte",

    // Cart
    shoppingCart: "Warenkorb",
    emptyCart: "Ihr Warenkorb ist leer",
    subtotal: "Zwischensumme",
    total: "Gesamt",
    checkout: "Zur Kasse",
    continueShopping: "Weiter Einkaufen",

    // Actions
    viewDetails: "Details Ansehen",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    back: "Zurück",
    next: "Weiter",
    submit: "Absenden",
  },
};

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved && translations[saved]) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  // Save language and update HTML attributes
  const setLanguage = (code) => {
    setLanguageState(code);
    localStorage.setItem("language", code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  };

  // Translation function
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
