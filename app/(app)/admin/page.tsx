'use client'

import { useEffect, useState } from "react";

type Member = {
  id: number;
  userId: number;
  clubId: number;
  role: string;
  user: { firstname: string; lastname: string; email: string };
  club: { name: string };
};

const roleOptions = ['member', 'president', 'secretary', 'treasurer'];
const sortOptions = [
  { label: "Club Name", value: "club" },
  { label: "Member Role", value: "role" },
  { label: "Event Name", value: "event" }, // Placeholder for future use
  { label: "User Email", value: "email" },
  { label: "User Name", value: "name" },
];



export default function ClubMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("club");

  useEffect(() => {
    fetch("/api/admin")
      .then(res => res.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (memberId: number, newRole: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, newRole }),
    });

    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case "club":
        return a.club.name.localeCompare(b.club.name);
      case "role":
        return a.role.localeCompare(b.role);
      case "email":
        return a.user.email.localeCompare(b.user.email);
      case "name":
        return (
          `${a.user.firstname} ${a.user.lastname}`.localeCompare(
            `${b.user.firstname} ${b.user.lastname}`
          )
        );
      case "event":
        return 0; // Placeholder
      default:
        return 0;
    }
  });

  if (loading) return <div className="p-6">Loading members...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Club Members</h1>
        <div>
          <label className="mr-2 font-medium">Sort by:</label>
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Member</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Club</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map(member => (
              <tr key={member.id}>
                <td className="px-4 py-2 border">
                  {member.user.firstname} {member.user.lastname}
                </td>
                <td className="px-4 py-2 border">{member.user.email}</td>
                <td className="px-4 py-2 border">{member.club.name}</td>
                <td className="px-4 py-2 border capitalize">{member.role}</td>
                <td className="px-4 py-2 border">
                  <select
                    className="border rounded px-2 py-1"
                    value={member.role}
                    onChange={e => handleRoleChange(member.id, e.target.value)}
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
