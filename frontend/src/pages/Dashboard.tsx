import React from 'react';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const transactions = [
    { id: 1, name: 'Netflix Subscription', type: 'expense', amount: 15.99, date: 'Today, 10:00 AM' },
    { id: 2, name: 'Salary Deposit', type: 'income', amount: 4500.00, date: 'Yesterday, 09:00 AM' },
    { id: 3, name: 'Coffee Shop', type: 'expense', amount: 4.50, date: 'May 10, 08:30 AM' },
    { id: 4, name: 'Freelance Payment', type: 'income', amount: 350.00, date: 'May 09, 02:15 PM' },
  ];

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
          <a href="#" className="nav-item">
            <Send size={20} />
            <span>Transfers</span>
          </a>
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
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h1 className="greeting">Good morning, John! 👋</h1>
          
          <div className="stats-grid">
            <div className="stat-card total-balance">
              <div className="stat-header">
                <h3>Total Balance</h3>
                <Wallet className="stat-icon" size={24} />
              </div>
              <h2>$12,450.00</h2>
              <p className="trend positive">+2.5% from last month</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <h3>Total Income</h3>
                <div className="icon-wrapper income">
                  <ArrowDownLeft size={24} />
                </div>
              </div>
              <h2>$4,850.00</h2>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <h3>Total Expense</h3>
                <div className="icon-wrapper expense">
                  <ArrowUpRight size={24} />
                </div>
              </div>
              <h2>$1,240.50</h2>
            </div>
          </div>

          <div className="transactions-section">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button className="view-all">View All</button>
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
