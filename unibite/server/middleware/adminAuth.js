import crypto from "node:crypto";

const tokenLifetimeMs = 8 * 60 * 60 * 1000;
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || "unibite-admin-development-secret";

function sign(payload) {
    return crypto
        .createHmac("sha256", adminSessionSecret)
        .update(payload)
        .digest("base64url");
}

export function createAdminToken(adminId) {
    const payload = `${adminId}.${Date.now()}`;
    return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function requireAdmin(req, res, next) {
    const authorization = req.get("Authorization") || "";
    const [encodedPayload, receivedSignature] = authorization.replace("Bearer ", "").split(".");

    if (!encodedPayload || !receivedSignature) {
        return res.status(401).json({ message: "Admin authentication required" });
    }

    try {
        const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
        const [adminId, issuedAt] = payload.split(".");
        const expectedSignature = sign(payload);
        const signaturesMatch = crypto.timingSafeEqual(
            Buffer.from(receivedSignature),
            Buffer.from(expectedSignature)
        );

        if (!signaturesMatch || !adminId || !issuedAt || Date.now() - Number(issuedAt) > tokenLifetimeMs) {
            return res.status(401).json({ message: "Invalid or expired admin session" });
        }

        req.adminId = Number(adminId);
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid admin session" });
    }
}