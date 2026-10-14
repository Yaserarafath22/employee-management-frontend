import { useEffect, useState } from "react";

const API = "http://localhost:8081/api/employees";
const emptyForm = { name: "", gmail: "", department: "", salary: "" };

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // 1. List-a backend-la irundhu edukkum
  const loadEmployees = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => setError("Backend-ai connect panna mudiyala"));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // 2. Form-la type pannina value-a state-la save pannum
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Add (POST) illa Update (PUT)
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, salary: Number(form.salary) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setForm(emptyForm);
        setEditId(null);
        setError("");
        loadEmployees();
      })
      .catch(() => setError("Save panna mudiyala. Data check pannunga."));
  };

  // 4. Delete
  const handleDelete = (id) => {
    if (!window.confirm("Indha employee-a delete pannalama?")) return;
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => loadEmployees())
      .catch(() => setError("Delete panna mudiyala"));
  };

  // 5. Edit click pannina data form-la varum
  const handleEdit = (emp) => {
    setEditId(emp.id);
    setForm({
      name: emp.name,
      gmail: emp.gmail || "",
      department: emp.department,
      salary: emp.salary,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Employee Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h3>{editId ? "Edit Employee" : "Add Employee"}</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />{" "}
        <input name="gmail" placeholder="Gmail" value={form.gmail} onChange={handleChange} />{" "}
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />{" "}
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} required />{" "}
        <button type="submit">{editId ? "Update" : "Add"}</button>{" "}
        {editId && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#4a90e2", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gmail</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.gmail}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>{" "}
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;