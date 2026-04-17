"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Table } from "@/app/components/Table";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string | null;
  role: string;
  createdAt: string;
}

export function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    employeeId: "",
    role: "",
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingEmployee, setIsSavingEmployee] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectsResponse, employeesResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/employees"),
        ]);

        if (!projectsResponse.ok || !employeesResponse.ok) {
          throw new Error("Failed to load admin data");
        }

        setProjects(await projectsResponse.json());
        setEmployees(await employeesResponse.json());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!projectForm.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setIsSavingProject(true);
      setError(null);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to create project");
      }

      const createdProject = await response.json();
      setProjects((current) => [createdProject, ...current]);
      setProjectForm({ name: "", description: "" });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create project");
    } finally {
      setIsSavingProject(false);
    }
  };

  const createEmployee = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!employeeForm.name.trim()) {
      setError("Employee name is required");
      return;
    }

    if (!employeeForm.role.trim()) {
      setError("Employee role is required");
      return;
    }

    try {
      setIsSavingEmployee(true);
      setError(null);

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeForm),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to create employee");
      }

      const createdEmployee = await response.json();
      setEmployees((current) => [createdEmployee, ...current]);
      setEmployeeForm({ name: "", employeeId: "", role: "" });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create employee");
    } finally {
      setIsSavingEmployee(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete project");
      }

      setProjects((current) => current.filter((project) => project.id !== projectId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete project");
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    if (!window.confirm("Delete this employee? This cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to delete employee");
      }

      setEmployees((current) => current.filter((employee) => employee.id !== employeeId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete employee");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin panel...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Admin</h1>
        <p className="text-slate-500 font-medium">Manage projects and employees from one place.</p>
      </header>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card title="Add Project">
          <form onSubmit={createProject} className="space-y-4">
            <Input
              label="Project Name"
              type="text"
              value={projectForm.name}
              onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
              placeholder="e.g., Office Renovation"
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
                placeholder="Brief description of the project"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <Button type="submit" isLoading={isSavingProject}>Create Project</Button>
          </form>
        </Card>

        <Card title="Add Employee">
          <form onSubmit={createEmployee} className="space-y-4">
            <Input
              label="Employee Name"
              type="text"
              value={employeeForm.name}
              onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })}
              placeholder="e.g., Khalid Ali"
              required
            />
            <Input
              label="Employee ID"
              type="text"
              value={employeeForm.employeeId}
              onChange={(event) => setEmployeeForm({ ...employeeForm, employeeId: event.target.value })}
              placeholder="e.g., EMP123"
            />
            <Input
              label="Employee Role"
              type="text"
              value={employeeForm.role}
              onChange={(event) => setEmployeeForm({ ...employeeForm, role: event.target.value })}
              placeholder="e.g., Supervisor"
              required
            />
            <Button type="submit" isLoading={isSavingEmployee}>Create Employee</Button>
          </form>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card title="Projects">
          {projects.length > 0 ? (
            <Table
              columns={[
                { header: "Project Name", accessor: "name" },
                { header: "Description", accessor: "description" },
                { header: "Created", accessor: "createdDisplay" },
                { header: "Action", accessor: "action" },
              ]}
              data={projects.map((project) => ({
                name: project.name,
                description: project.description || "-",
                createdDisplay: new Date(project.createdAt).toLocaleDateString(),
                action: (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      void deleteProject(project.id);
                    }}
                  >
                    Delete
                  </Button>
                ),
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No projects yet.</p>
          )}
        </Card>

        <Card title="Employees">
          {employees.length > 0 ? (
            <Table
              columns={[
                { header: "Employee", accessor: "name" },
                { header: "Employee ID", accessor: "employeeId" },
                { header: "Role", accessor: "role" },
                { header: "Action", accessor: "action" },
              ]}
              data={employees.map((employee) => ({
                name: employee.name,
                employeeId: employee.employeeId || "-",
                role: employee.role,
                action: (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      void deleteEmployee(employee.id);
                    }}
                  >
                    Delete
                  </Button>
                ),
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No employees yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}