const db = require('../../config/db');
const SESSION_KEY = "mi_bot";

// guardar sesión
async function saveSession(data) {
    const json = JSON.stringify(data);

    const [rows] = await db.query(
        "SELECT * FROM whatsapp_session WHERE session_key = ?",
        [SESSION_KEY]
    );

    if (rows.length > 0) {
        await db.query(
            "UPDATE whatsapp_session SET session_data=? WHERE session_key=?",
            [json, SESSION_KEY]
        );
    } else {
        await db.query(
            "INSERT INTO whatsapp_session (session_key, session_data) VALUES (?, ?)",
            [SESSION_KEY, json]
        );
    }
}

// obtener sesión
async function getSession() {
    const [rows] = await db.query(
        "SELECT * FROM whatsapp_session WHERE session_key = ?",
        [SESSION_KEY]
    );

    if (rows.length > 0) {
        return JSON.parse(rows[0].session_data);
    }

    return null;
}

module.exports = { saveSession, getSession };