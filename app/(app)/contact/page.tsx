"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6 text-muted-foreground">
        Have questions or want to get in touch? Fill out the form below and we’ll get back to you soon.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </main>
  );
};

export default ContactPage;
