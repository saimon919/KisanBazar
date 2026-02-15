import { createContext, useState, useContext, type ReactNode } from 'react';

export interface Product {
    id: string;
    name: string;
    category: 'Vegetable' | 'Fruit' | 'Grain';
    price: number;
    unit: string;
    image: string;
    farmer: string;
    farmer_id?: string;
    description: string;
    isVerified?: boolean;
    harvestDate?: string;
    latitude?: number;
    longitude?: number;
}


interface ProductContextType {
    products: Product[];
    getProductById: (id: string) => Product | undefined;
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    logOfflineSale: (productId: string, quantity: number, totalAmount: number) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch from server');

            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('API returned non-array data:', data);
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to fetch products', err);
            setProducts([]);
        }
    };

    // Fetch products on mount
    useState(() => {
        fetchProducts();
        return undefined;
    });

    const getProductById = (id: string) => products.find(p => p.id === id);

    const getAuthHeader = (): Record<string, string> => {
        const token = localStorage.getItem('kb_token');
        return token ? { 'x-auth-token': token } : {};
    };

    const addProduct = async (newProduct: Omit<Product, 'id'>) => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            };
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers,
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                fetchProducts();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to add product');
            }
        } catch (err) {
            console.error('Error adding product', err);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            };
            const response = await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(updatedProduct),
            });
            if (response.ok) {
                fetchProducts();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update product');
            }
        } catch (err) {
            console.error('Error updating product', err);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const headers: Record<string, string> = {
                ...getAuthHeader()
            };
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers,
            });
            if (response.ok) {
                fetchProducts();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete product');
            }
        } catch (err) {
            console.error('Error deleting product', err);
        }
    };

    const logOfflineSale = async (productId: string, quantity: number, totalAmount: number) => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            };
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    productId,
                    quantity,
                    totalAmount,
                    is_offline: true
                }),
            });
            if (response.ok) {
                fetchProducts();
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error logging offline sale', err);
            return false;
        }
    };

    return (
        <ProductContext.Provider value={{ products, getProductById, addProduct, updateProduct, deleteProduct, logOfflineSale }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
