// --- (НОВИЙ ФАЙЛ) frontend/src/components/pages/sub/TransactionReceiptPDF.js (v16.0) ---
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// РЕЄСТРАЦІЯ ШРИФТУ (дуже важливо!)
// Це вказує, де знайти шрифт, який ви додали у /public
Font.register({ 
  family: 'Roboto', 
  src: '/Roboto-Regular.ttf' 
});

// Створюємо стилі для PDF (схоже на CSS, але це не CSS)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto', // Використовуємо наш шрифт
    padding: 30,
    backgroundColor: '#FFFFFF',
    color: '#111111',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0052FF',
  },
  section: {
    border: '1px solid #E5E5EA',
    borderRadius: 5,
    marginBottom: 15,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#F5F5F7',
    borderBottom: '1px solid #E5E5EA',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionBody: {
    padding: 15,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 12,
  },
  label: {
    color: '#8A8A8E',
  },
  value: {
    fontWeight: 'bold',
    maxWidth: '60%',
    textAlign: 'right'
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  statusSuccess: {
    color: '#34C759',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  statusError: {
    color: '#FF3B30',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#C7C7CC',
  },
  txId: {
    fontSize: 10,
    color: '#8A8A8E',
    marginTop: 15,
  }
});

// Helper-функція для форматування дати
const formatFullDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Сам компонент документу
const TransactionReceiptPDF = ({ tx }) => {
  if (!tx) return null;
  
  const isIncome = tx.amount > 0;
  const amountStr = `${isIncome ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('de-DE')} ${tx.currency}`;
  
  return (
    <Document title={`Квитанція ${tx.id}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Квитанція про операцію</Text>
        
        {/* Секція суми */}
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <Text style={{...styles.amount, color: isIncome ? '#34C759' : '#111111'}}>
              {amountStr}
            </Text>
            <Text style={styles.statusSuccess}>
              {isIncome ? 'Успішно зараховано' : 'Успішно виконано'}
            </Text>
          </View>
        </View>

        {/* Секція деталей */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerText}>Деталі операції</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Отримувач / Відправник</Text>
              <Text style={styles.value}>{tx.from}</Text>
            </View>
             <View style={styles.row}>
              <Text style={styles.label}>Дата і час</Text>
              <Text style={styles.value}>{formatFullDate(tx.date)}</Text>
            </View>
             <View style={styles.row}>
              <Text style={styles.label}>Категорія</Text>
              <Text style={styles.value}>{tx.category || 'Без категорії'}</Text>
            </View>
             <View style={styles.row}>
              <Text style={styles.label}>Тип операції</Text>
              <Text style={styles.value}>{tx.type}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>ID Транзакції</Text>
              <Text style={{...styles.value, ...styles.txId}}>{tx.id}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.footer}>
          Дякуємо, що користуєтесь послугами "Супер-Додаток"
        </Text>
      </Page>
    </Document>
  );
};

export default TransactionReceiptPDF;