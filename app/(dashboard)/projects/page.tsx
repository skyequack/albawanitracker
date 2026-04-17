"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card } from "@/app/components/Card";
import { Table } from "@/app/components/Table";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function ProjectsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setError("Sign in to view projects.");
      return;
    }

    fetchProjects();
  }, [isLoaded, isSignedIn]);

  const fetchProjects = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/projects");
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || `Failed to fetch projects (${response.status})`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card>
        {projects.length > 0 ? (
          <Table
            columns={[
              { header: "Project Name", accessor: "name" },
              { header: "Description", accessor: "description" },
              { header: "Created", accessor: "createdDisplay" },
            ]}
            data={projects.map((p) => ({
              name: p.name,
              description: p.description || "-",
              createdDisplay: new Date(p.createdAt).toLocaleDateString(),
            }))}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">
            No projects yet.
          </p>
        )}
      </Card>
    </div>
  );
}
