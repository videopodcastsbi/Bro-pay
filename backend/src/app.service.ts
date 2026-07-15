import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [
    { name: 'John Doe', email: 'bro@example.com', password: 'password' },
  ];

  private totalIncome = 0;
  private totalExpense = 0;

  private transactions: any[] = [];

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  getHello(): string {
    return 'Bro Pay API is running!';
  }

  register(body: any) {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new BadRequestException('All fields are required');
    }
    const exists = this.users.find(u => u.email === email);
    if (exists) {
      throw new BadRequestException('User already exists');
    }
    const newUser = { name, email, password };
    this.users.push(newUser);
    return { success: true, message: 'User registered successfully', user: { name, email } };
  }

  login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      success: true,
      message: 'Login successful',
      user: { name: user.name, email: user.email },
      token: 'mock-jwt-token-bro-pay',
    };
  }

  getDashboard() {
    return {
      balance: this.balance,
      income: this.totalIncome,
      expense: this.totalExpense,
      transactions: this.transactions,
    };
  }

  createTransaction(body: any) {
    const { action, amount, target } = body; 
    // action: 'topup', 'transfer', 'withdraw', 'receive'
    // target: string (e.g. 'Bank Deposit', 'John Doe')
    
    if (!action || !amount || !target) {
      throw new BadRequestException('Action, amount, and target are required');
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const newId = this.transactions.length + 1;
    const dateStr = new Date().toISOString();
    
    let type = '';
    let category = '';
    
    if (action === 'topup') {
      type = 'income';
      category = 'Top Up';
      this.totalIncome += parsedAmount;
    } else if (action === 'receive') {
      type = 'income';
      category = 'Receive';
      this.totalIncome += parsedAmount;
    } else if (action === 'transfer') {
      if (parsedAmount > this.balance) {
        throw new BadRequestException('Insufficient balance');
      }
      type = 'expense';
      category = 'Transfer';
      this.totalExpense += parsedAmount;
    } else if (action === 'withdraw') {
      if (parsedAmount > this.balance) {
        throw new BadRequestException('Insufficient balance');
      }
      type = 'expense';
      category = 'Withdraw';
      this.totalExpense += parsedAmount;
    } else {
      throw new BadRequestException('Unknown action type');
    }

    const newTx = {
      id: newId,
      name: target,
      type,
      category,
      amount: parsedAmount,
      date: dateStr,
    };

    this.transactions.unshift(newTx); // Add to beginning

    return { success: true, transaction: newTx, balance: this.balance };
  }
}
