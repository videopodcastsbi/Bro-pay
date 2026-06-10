import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Activity,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import '../styles/dashboard.css';

interface Transaction {
  id: number;
  name: string;
  type: string;
  amount: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState<string>('John Doe');

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setIncome(data.income);
        setExpense(data.expense);
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  useEffect(() => {
    // Get user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.name) {
          setUserName(parsed.name);
        }
      } catch (e) {
        // use default
      }
    }
    
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTransfer = async () => {
    const name = prompt('Enter recipient / sender name:');
    if (!name) return;

    const amountStr = prompt('Enter amount ($):');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    const type = confirm('Is this an Income? (Cancel for Expense)') ? 'income' : 'expense';

    try {
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, amount }),
      });
      if (response.ok) {
        alert('Transaction successful!');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || 'Transaction failed');
      }
    } catch (err) {
      alert('Cannot connect to the server');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Wallet className="brand-icon" size={28} />
          <h2>Bro Pay</h2>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <Activity size={20} />
            <span>Overview</span>
          </a>
          <button className="nav-item" onClick={handleTransfer} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <Send size={20} />
            <span>Transfers</span>
          </button>
          <a href="#" className="nav-item">
            <Wallet size={20} />
            <span>Wallets</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search transactions, contacts..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="avatar">
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h1 className="greeting">Good morning, {userName.split(' ')[0]}! 👋</h1>
          
          <div className="stats-grid">
            <div className="stat-card total-balance">
              <div className="stat-header">
                <h3>Total Balance</h3>
                <Wallet className="stat-icon" size={24} />
              </div>
              <h2>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className="trend positive">+2.5% from last month</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <h3>Total Income</h3>
                <div className="icon-wrapper income">
                  <ArrowDownLeft size={24} />
                </div>
              </div>
              <h2>${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <h3>Total Expense</h3>
                <div className="icon-wrapper expense">
                  <ArrowUpRight size={24} />
                </div>
              </div>
              <h2>${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
          </div>

          <div className="transactions-section">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button className="view-all" onClick={handleTransfer}>Add Transaction</button>
            </div>
            
            <div className="transactions-list">
              {transactions.map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-info">
                    <div className={`tx-icon ${tx.type}`}>
                      {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4>{tx.name}</h4>
                      <p>{tx.date}</p>
                    </div>
                  </div>
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
