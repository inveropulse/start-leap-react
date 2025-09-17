import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Plus, 
  CreditCard, 
  Banknote, 
  Building2, 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle,
  Edit2,
  Receipt 
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { AppointmentPayment, PaymentMethod, PaymentStatus } from '../../types/management.types';
import { appointmentManagementService } from '../../services/appointmentManagementService';

interface AppointmentPaymentTabProps {
  payments: AppointmentPayment[];
  appointmentId: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function AppointmentPaymentTab({
  payments,
  appointmentId,
  isLoading,
  onRefresh,
}: AppointmentPaymentTabProps) {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: PaymentMethod.CASH,
    reference: '',
    notes: '',
    paidBy: '',
  });

  const handleAddPayment = async () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await appointmentManagementService.addPayment(appointmentId, {
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        reference: paymentForm.reference || undefined,
        notes: paymentForm.notes || undefined,
        paidBy: paymentForm.paidBy || undefined,
      });
      
      setPaymentForm({
        amount: '',
        method: PaymentMethod.CASH,
        reference: '',
        notes: '',
        paidBy: '',
      });
      setIsAddingPayment(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to add payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CARD:
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case PaymentMethod.CASH:
        return <Banknote className="h-4 w-4 text-green-600" />;
      case PaymentMethod.BANK_TRANSFER:
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case PaymentMethod.INSURANCE:
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case PaymentStatus.PARTIAL:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case PaymentStatus.REFUNDED:
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <Badge variant="default" className="text-xs">Paid</Badge>;
      case PaymentStatus.PENDING:
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case PaymentStatus.FAILED:
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      case PaymentStatus.PARTIAL:
        return <Badge variant="outline" className="text-xs">Partial</Badge>;
      case PaymentStatus.REFUNDED:
        return <Badge variant="outline" className="text-xs">Refunded</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case PaymentMethod.CARD:
        return 'Card Payment';
      case PaymentMethod.CASH:
        return 'Cash';
      case PaymentMethod.BANK_TRANSFER:
        return 'Bank Transfer';
      case PaymentMethod.INSURANCE:
        return 'Insurance';
      case PaymentMethod.OTHER:
        return 'Other';
      default:
        return method;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'GBP'): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => {
      return payment.status === PaymentStatus.PAID || payment.status === PaymentStatus.PARTIAL
        ? total + payment.amount
        : total;
    }, 0);
  };

  const getPendingAmount = () => {
    return payments.reduce((total, payment) => {
      return payment.status === PaymentStatus.PENDING
        ? total + payment.amount
        : total;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Payment Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Payment Management</h3>
        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={paymentForm.method}
                  onValueChange={(value: PaymentMethod) => setPaymentForm({ ...paymentForm, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem key={method} value={method}>
                        {getPaymentMethodLabel(method)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paidBy">Paid By</Label>
                <Input
                  id="paidBy"
                  value={paymentForm.paidBy}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidBy: e.target.value })}
                  placeholder="Patient name or entity"
                />
              </div>
              <div>
                <Label htmlFor="reference">Payment Reference</Label>
                <Input
                  id="reference"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="Transaction ID, receipt number, etc."
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Additional payment notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingPayment(false);
                    setPaymentForm({
                      amount: '',
                      method: PaymentMethod.CASH,
                      reference: '',
                      notes: '',
                      paidBy: '',
                    });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPayment}
                  disabled={!paymentForm.amount || parseFloat(paymentForm.amount) <= 0 || isSubmitting}
                >
                  {isSubmitting ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(getTotalAmount())}
          </div>
          <div className="text-sm text-muted-foreground">Total Paid</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {formatCurrency(getPendingAmount())}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {payments.length}
          </div>
          <div className="text-sm text-muted-foreground">Transactions</div>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h4 className="font-medium mb-3">Payment History</h4>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    {getPaymentMethodIcon(payment.method)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getPaymentMethodLabel(payment.method)}
                      {payment.reference && (
                        <span className="ml-2">• Ref: {payment.reference}</span>
                      )}
                    </div>
                    {payment.paidBy && (
                      <div className="text-sm text-muted-foreground">
                        Paid by {payment.paidBy}
                      </div>
                    )}
                    {payment.notes && (
                      <div className="text-sm text-muted-foreground italic mt-1">
                        {payment.notes}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {payment.paidAt ? (
                        <>
                          Paid {format(new Date(payment.paidAt), 'MMM dd, yyyy • HH:mm')}
                          {payment.confirmedBy && (
                            <span className="ml-2">• Confirmed by {payment.confirmedBy}</span>
                          )}
                        </>
                      ) : (
                        `Created ${format(new Date(payment.createdAt), 'MMM dd, yyyy • HH:mm')}`
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}