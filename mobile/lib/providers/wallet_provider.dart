import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Transaction {
  final String id;
  final String type; // 'income' or 'expense'
  final String category; // 'Top Up', 'Transfer', 'Receive', 'Withdraw'
  final String name;
  final double amount;
  final DateTime date;

  Transaction({
    required this.id,
    required this.type,
    required this.category,
    required this.name,
    required this.amount,
    required this.date,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'].toString(),
      type: json['type'] ?? '',
      category: json['category'] ?? '',
      name: json['name'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
    );
  }
}

class WalletProvider with ChangeNotifier {
  double _balance = 0.0;
  double _income = 0.0;
  double _expense = 0.0;
  List<Transaction> _transactions = [];
  bool _isLoading = false;

  double get balance => _balance;
  double get income => _income;
  double get expense => _expense;
  List<Transaction> get transactions => _transactions;
  bool get isLoading => _isLoading;

  final String baseUrl = 'http://localhost:3000/api';

  Future<void> fetchDashboard() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.get(Uri.parse('$baseUrl/dashboard'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _balance = (data['balance'] ?? 0).toDouble();
        _income = (data['income'] ?? 0).toDouble();
        _expense = (data['expense'] ?? 0).toDouble();
        
        if (data['transactions'] != null) {
          _transactions = (data['transactions'] as List)
              .map((tx) => Transaction.fromJson(tx))
              .toList();
        }
      }
    } catch (e) {
      debugPrint('Error fetching dashboard: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> topUp(double amount, String name) async {
    return _createTransaction('topup', amount, name);
  }

  Future<bool> transfer(double amount, String recipientName) async {
    return _createTransaction('transfer', amount, recipientName);
  }

  Future<bool> withdraw(double amount, String name) async {
    return _createTransaction('withdraw', amount, name);
  }

  Future<bool> _createTransaction(String action, double amount, String target) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/transactions'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'action': action,
          'amount': amount,
          'target': target,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Refresh dashboard to get latest accurate state from server
        await fetchDashboard();
        return true;
      } else {
        debugPrint('Transaction failed: ${response.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Error creating transaction: $e');
      return false;
    }
  }
}
