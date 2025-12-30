import { notFound } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

async function getPaste(id: string): Promise<PasteResponse | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;   
  const paste = await getPaste(id);

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          color: "#111",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>

      <div style={{ marginTop: "1rem", color: "#555" }}>
        {paste.remaining_views !== null && (
          <p>Remaining views: {paste.remaining_views}</p>
        )}
        {paste.expires_at && (
          <p>
            Expires at: {new Date(paste.expires_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
            })}
          </p>
        )}
      </div>
    </main>
  );
}
