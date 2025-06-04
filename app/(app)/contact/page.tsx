import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ContactPage = () => {
    return (
        <main className="max-w-xl mx-auto p-6">
            
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="mb-6 text-muted-foreground">
                Have questions or want to get in touch? Fill out the form below and we’ll get back to you soon.
            </p>
            <form className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Type your message here..."
                    />
                </div>
                <Button type="submit" className="w-full">
                    Send Message
                </Button>
            </form>
        </main>
    );
};

export default ContactPage;
