const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.readyio.com").replace(/\/$/, "");

export type NewsletterResult = { success: boolean; message: string };

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  try {
    const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    if (!res.ok) {
      return { success: false, message: json.error || json.message || "Subscription failed. Please try again." };
    }
    return { success: true, message: json.message || "Successfully subscribed to Readyio newsletter!" };
  } catch {
    return { success: false, message: "Subscription failed. Please check your connection." };
  }
}
