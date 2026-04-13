import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { Product, Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const ADMIN_EMAIL = "mimpy124ahon124@gmail.com";

const formatPrice = (price: number) => {
  return `৳${price.toLocaleString('en-BD')}`;
};

export default function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Admin page mounted, checking auth state...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `Logged in as ${user.email}` : 'Not logged in');
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state error:', error);
      setLoading(false);
      toast.error('Authentication error. Please refresh.');
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      toast.error(`Login failed: ${errorMessage}`);
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        toast.error(`CRITICAL: Domain "${domain}" is not authorized in Firebase.`, {
          duration: 10000,
          description: "Please go to Firebase Console > Authentication > Settings > Authorized domains and add this domain."
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-luxury-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mb-4"></div>
        <p className="text-luxury-gold font-serif italic animate-pulse">Initializing Admin Portal...</p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-luxury-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-luxury-gold" />
          </div>
          <h1 className="text-3xl font-serif mb-4">Admin Access</h1>
          <p className="text-gray-500 mb-8 font-light">
            Please sign in with your authorized administrator account to manage Veluxe.
          </p>
          <Button 
            onClick={handleLogin}
            className="w-full bg-luxury-black text-white py-6 rounded-none hover:bg-luxury-black/90 transition-all mb-4"
          >
            SIGN IN WITH GOOGLE
          </Button>
          <Link to="/" className="text-xs uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors">
            Back to Storefront
          </Link>
          {user && user.email !== ADMIN_EMAIL && (
            <p className="mt-4 text-red-500 text-sm">
              Account {user.email} is not authorized.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-luxury-cream text-gray-700 hover:text-luxury-black transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-luxury-cream text-gray-700 hover:text-luxury-black transition-colors">
            <Package className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-luxury-cream text-gray-700 hover:text-luxury-black transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </Link>
        </nav>
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-4 px-3">
            <img src={user.photoURL || ''} alt="Admin" className="w-8 h-8 rounded-full" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user.displayName}</span>
              <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
        </Routes>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const productsSnap = await getDocs(collection(db, 'products'));
      const ordersSnap = await getDocs(collection(db, 'orders'));
      
      let revenue = 0;
      ordersSnap.forEach(doc => {
        revenue += doc.data().totalAmount || 0;
      });

      setStats({
        products: productsSnap.size,
        orders: ordersSnap.size,
        revenue
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-luxury-gold">৳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Completed & Pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      let fileToRead = file;

      // Check for HEIC/HEIF format
      const isHeic = file.type === 'image/heic' || 
                     file.type === 'image/heif' || 
                     file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif');

      if (isHeic) {
        toast.info('Converting HEIC image...');
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.7
        });
        
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        fileToRead = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        });
      }

      // Compress image if it's still large
      if (fileToRead.size > 500 * 1024) { // If larger than 500KB
        toast.info('Compressing image...');
        const options = {
          maxSizeMB: 0.7,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        try {
          const compressedFile = await imageCompression(fileToRead, options);
          fileToRead = new File([compressedFile], fileToRead.name, {
            type: compressedFile.type,
          });
        } catch (error) {
          console.error('Compression error:', error);
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Final check for base64 size (Firestore 1MB limit)
        if (result.length > 1048576) {
          setUploading(false);
          toast.error('Image is still too large after compression. Please use a smaller image.');
          return;
        }
        setFormData({ ...formData, image: result });
        setUploading(false);
        toast.success('Image uploaded and optimized');
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(fileToRead);
    } catch (error) {
      console.error('Image processing error:', error);
      setUploading(false);
      toast.error('Failed to process image format');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => {
      console.error('Error fetching products:', error);
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock);

      if (isNaN(price) || isNaN(stock)) {
        toast.error('Please enter valid numbers for price and stock');
        return;
      }

      const data = {
        ...formData,
        price,
        stock,
        createdAt: new Date().toISOString()
      };

      if (editingProduct) {
        try {
          await updateDoc(doc(db, 'products', editingProduct.id!), data);
          toast.success('Product updated successfully');
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `products/${editingProduct.id}`);
        }
      } else {
        try {
          await addDoc(collection(db, 'products'), data);
          toast.success('Product added successfully');
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'products');
        }
      }
      setIsAddOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    } catch (error) {
      console.error('Error in handleSave:', error);
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
            toast.error('Permission denied. Please check if all fields are valid.');
          } else {
            toast.error('Error saving product: ' + (parsedError.error || error.message));
          }
        } catch {
          toast.error('Error saving product: ' + error.message);
        }
      } else {
        toast.error('Error saving product');
      }
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      setDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Products</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-luxury-black text-white hover:bg-luxury-black/90">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex flex-col space-y-2">
                  <Input 
                    id="image-file" 
                    type="file" 
                    accept="image/*,.heic,.heif" 
                    onChange={handleImageUpload} 
                    className="cursor-pointer"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Or URL:</span>
                    <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                  </div>
                  {formData.image && (
                    <div className="mt-2 relative w-20 h-20 border rounded overflow-hidden">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {uploading && <p className="text-xs text-luxury-gold animate-pulse">Processing image...</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-white">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingProduct(product);
                    setFormData({
                      name: product.name,
                      description: product.description,
                      price: product.price.toString(),
                      image: product.image,
                      category: product.category,
                      stock: product.stock.toString()
                    });
                    setIsAddOpen(true);
                  }}>
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id!)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px] text-center py-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif mb-4">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 mb-8">Are you sure you want to remove this product from the collection? This action cannot be undone.</p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 rounded-none py-6">CANCEL</Button>
            <Button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-none py-6">DELETE</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ords);
    }, (error) => {
      console.error('Error fetching orders:', error);
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif">Orders</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id?.slice(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{order.items.length} items</span>
                    <div className="flex flex-wrap gap-1">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 px-1 rounded">
                          {item.quantity}x {item.size || 'N/A'}
                        </span>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{formatPrice(order.totalAmount)}</span>
                    {order.shippingCost && (
                      <span className="text-[10px] text-gray-400">Incl. {formatPrice(order.shippingCost)} shipping</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <select 
                    className="text-xs border rounded p-1"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id!, e.target.value as Order['status'])}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
