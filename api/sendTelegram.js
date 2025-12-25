export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        name,
        telegram,
        workType,
        subject,
        details,
    } = req.body;

    // 🔒 Серверная защита
    if (!telegram || !workType || !details) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CREATOR_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: "Server configuration error" });
    }

    // ✨ Формируем красивое сообщение
    const message = `
📝 <b>Новая заявка — Flayzex UniHelp</b>

👤 <b>Имя:</b> ${name || "—"}
📬 <b>Telegram:</b> ${telegram}
📚 <b>Тип работы:</b> ${workType}
📖 <b>Предмет / тема:</b> ${subject || "—"}

🗒 <b>Дополнительные детали:</b>
${details}
`.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Telegram API error");
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message" });
    }
}
