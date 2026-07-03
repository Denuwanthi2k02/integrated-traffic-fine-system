import React, { useState, useEffect, useCallback } from "react";
import { Search, List, RefreshCw, Plus, X } from "lucide-react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import { getRecentTransactions, createFine } from "../services/api";
import styles from "./DashboardHome.module.css";

const CATEGORIES = [
  "Speeding",
  "No License",
  "Illegal Parking",
  "Drunk Driving",
  "Using Phone",
  "No Seatbelt",
];

const TransactionsPage = () => {
  const [filters, setFilters] = useState({
    district: "all",
    status: "all",
    category: "all",
    month: "all",
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    referenceNumber: `SLP-${Math.floor(100000 + Math.random() * 900000)}`, // Auto-generate random reference
    category: "SPEEDING",
    district: "Colombo",
    officer: "",
    amount: "",
    licensePlate: "",
    licenseNumber: "",
    driverName: "",
    violationDetails: ""
  });

  const fetchTransactions = useCallback(() => {
    let active = true;
    setLoading(true);

    getRecentTransactions(filters)
      .then((d) => {
        if (active) {
          setData(Array.isArray(d) ? d : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setData([]);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  useEffect(() => {
    const cleanup = fetchTransactions();
    return cleanup;
  }, [fetchTransactions]);

  const normalizedSearch = search.toLowerCase();
  const filtered = (Array.isArray(data) ? data : []).filter((tx) => {
    const reference = String(tx.referenceNumber || tx.id || "").toLowerCase();
    const category = String(tx.category || "").toLowerCase();
    const district = String(tx.district || "").toLowerCase();
    const officer = String(tx.officer || "").toLowerCase();

    return (
      reference.includes(normalizedSearch) ||
      category.includes(normalizedSearch) ||
      district.includes(normalizedSearch) ||
      officer.includes(normalizedSearch)
    );
  });

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit New Fine to Backend
  const handleIssueFine = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createFine(formData);
      setIsModalOpen(false); // Close Modal
      fetchTransactions();   // Refresh table to show new fine instantly
      // Reset form with new random reference number
      setFormData({
        referenceNumber: `SLP-${Math.floor(100000 + Math.random() * 900000)}`,
        category: "SPEEDING",
        district: "Colombo",
        officer: "",
        amount: "",
        licensePlate: "",
        licenseNumber: "",
        driverName: "",
        violationDetails: ""
      });
    } catch (error) {
      console.error("Failed to create fine", error);
      alert("Failed to create fine. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="All fine payment transactions with filtering and search"
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        categories={CATEGORIES}
      />

      <Card title="Fine transactions" icon={List}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-light)",
              }}
            />
            <input
              type="text"
              placeholder="Search by reference, category, district, officer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "13px",
                outline: "none",
                background: "#f8fafc",
                color: "var(--color-text)",
              }}
            />
          </div>
          
          {/* Issue Fine Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "0 15px",
              background: "#10b981", // Green color
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >
            <Plus size={16} /> Issue Fine
          </button>

          <button 
            onClick={fetchTransactions}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "0 15px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingWrap} style={{ height: "200px" }}>
            <div className={styles.spinner} />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginBottom: "8px",
              }}
            >
              Showing {filtered.length} transaction
              {filtered.length !== 1 ? "s" : ""}
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Reference #</th>
                    <th>Category</th>
                    <th>District</th>
                    <th>Officer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          color: "var(--color-text-muted)",
                          padding: "2rem",
                        }}
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx) => {
                      const reference = tx.referenceNumber || tx.id?.toString() || "N/A";
                      const isPaid = tx.status && tx.status.toUpperCase() === "PAID";

                      return (
                        <tr key={reference}>
                          <td className={styles.mono}>{reference}</td>
                          <td>
                            <span
                              style={{
                                background: "#f1f5f9",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              {tx.category || "Unknown"}
                            </span>
                          </td>
                          <td>{tx.district || "—"}</td>
                          <td style={{ color: "var(--color-text-muted)" }}>
                            {tx.officer || "—"}
                          </td>
                          <td style={{ fontWeight: 700 }}>
                            Rs. {Number(tx.amount || 0).toLocaleString()}
                          </td>
                          <td style={{ color: "var(--color-text-muted)" }}>
                            {tx.date || "—"}
                          </td>
                          <td>
                            {isPaid ? (
                              <span style={{
                                background: "#dcfce7", 
                                color: "#166534", 
                                padding: "4px 10px", 
                                borderRadius: "12px", 
                                fontSize: "12px", 
                                fontWeight: "600"
                              }}>
                                Paid
                              </span>
                            ) : (
                              <span style={{
                                background: "#fef3c7", 
                                color: "#b45309", 
                                padding: "4px 10px", 
                                borderRadius: "12px", 
                                fontSize: "12px", 
                                fontWeight: "600"
                              }}>
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* --- MODAL FOR ISSUING FINES --- */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "white", width: "500px", borderRadius: "8px", padding: "24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)", position: "relative"
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px" }}>Issue Traffic Fine</h2>
            
            <form onSubmit={handleIssueFine} style={{ display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
              
              {/* Form Row 1 */}
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Reference No</label>
                <input required name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Amount (Rs.)</label>
                <input required type="number" name="amount" value={formData.amount} onChange={handleInputChange} style={inputStyle} placeholder="e.g. 3000" />
              </div>

              {/* Form Row 2 */}
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat.toUpperCase()}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>District</label>
                <select required name="district" value={formData.district} onChange={handleInputChange} style={inputStyle}>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Kurunegala">Kurunegala</option>
                </select>
              </div>

              {/* Form Row 3 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Driver Name</label>
                <input required name="driverName" value={formData.driverName} onChange={handleInputChange} style={inputStyle} placeholder="John Doe" />
              </div>

              {/* Form Row 4 */}
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>License Plate</label>
                <input required name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} style={inputStyle} placeholder="WP ABC 1234" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>License Number</label>
                <input required name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} style={inputStyle} placeholder="B1234567" />
              </div>
              
              {/* Form Row 5 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Officer Name</label>
                <input required name="officer" value={formData.officer} onChange={handleInputChange} style={inputStyle} placeholder="Sgt. Perera" />
              </div>

              {/* Form Row 6 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "5px", color: "#64748b" }}>Violation Details</label>
                <textarea required name="violationDetails" value={formData.violationDetails} onChange={handleInputChange} style={{ ...inputStyle, minHeight: "60px", resize: "none" }} placeholder="Brief description of the violation..." />
              </div>

              {/* Submit Button */}
              <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
                <button type="submit" disabled={isSubmitting} style={{
                  width: "100%", padding: "10px", background: "#3b82f6", color: "white", 
                  border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "600"
                }}>
                  {isSubmitting ? "Saving..." : "Create Fine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple reusable input style for the modal
const inputStyle = {
  width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", 
  borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box"
};

export default TransactionsPage;