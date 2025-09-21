interface StorageItem<T> {
  value: T;
  expiry?: number;
}

class Storage {
  private prefix: string;

  constructor(prefix: string = 'booklib_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T, expiryInMinutes?: number): void {
    try {
      const item: StorageItem<T> = {
        value,
        expiry: expiryInMinutes ? Date.now() + (expiryInMinutes * 60 * 1000) : undefined,
      };
      
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);
      
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  exists(key: string): boolean {
    return this.get(key) !== null;
  }

  size(): number {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.prefix)).length;
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }
}

export const storage = new Storage();

export const authStorage = {
  setToken: (token: string) => storage.set('auth_token', token),
  getToken: () => storage.get<string>('auth_token'),
  removeToken: () => storage.remove('auth_token'),
  
  setUser: (user: any) => storage.set('user', user),
  getUser: () => storage.get('user'),
  removeUser: () => storage.remove('user'),
  
  clearAuth: () => {
    storage.remove('auth_token');
    storage.remove('user');
  },
  
  isAuthenticated: () => !!storage.get('auth_token'),
};

export const bookStorage = {
  setSearchHistory: (searches: string[]) => storage.set('search_history', searches, 60 * 24 * 7),
  getSearchHistory: () => storage.get<string[]>('search_history') || [],
  addSearch: (search: string) => {
    const history = bookStorage.getSearchHistory();
    const updatedHistory = [search, ...history.filter(s => s !== search)].slice(0, 10);
    bookStorage.setSearchHistory(updatedHistory);
  },
  
  setRecentBooks: (books: any[]) => storage.set('recent_books', books, 60 * 24),
  getRecentBooks: () => storage.get<any[]>('recent_books') || [],
  addRecentBook: (book: any) => {
    const recent = bookStorage.getRecentBooks();
    const updated = [book, ...recent.filter(b => b.id !== book.id)].slice(0, 5);
    bookStorage.setRecentBooks(updated);
  },
};

export default storage;