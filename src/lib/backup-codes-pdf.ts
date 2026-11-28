import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export interface BackupCodesPdfParams {
  codes: string[];
  accountEmail: string;
  accountName?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBackupCodesHtml({
  codes,
  accountEmail,
  accountName,
}: BackupCodesPdfParams): string {
  const generatedAt = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const safeName = escapeHtml(accountName?.trim() || "WealthFlow Member");
  const safeEmail = escapeHtml(accountEmail);

  const codeCells = codes
    .map((code, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      return `
        <div class="code-card">
          <span class="code-index">${num}</span>
          <span class="code-value">${escapeHtml(code)}</span>
        </div>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WealthFlow — 2FA Backup Codes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      padding: 40px 44px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1.5px solid #E2E8F0;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0A84FF 0%, #554BC9 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: #0B0B1A;
    }
    .brand-sub {
      font-size: 12px;
      color: #64748B;
      margin-top: 2px;
    }
    .doc-badge {
      text-align: right;
    }
    .doc-pill {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 999px;
      background: #EBF5FF;
      color: #0A84FF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .doc-date {
      font-size: 11px;
      color: #64748B;
      margin-top: 6px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 16px 18px;
      margin-bottom: 24px;
    }
    .meta-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #64748B;
      margin-bottom: 4px;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 600;
      color: #0F172A;
      word-break: break-word;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .section-desc {
      font-size: 12.5px;
      color: #475569;
      margin-bottom: 16px;
    }
    .codes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 26px;
    }
    .code-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 16px;
      border-radius: 12px;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
    }
    .code-index {
      font-size: 11px;
      font-weight: 700;
      color: #0A84FF;
      background: #EBF5FF;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .code-value {
      font-family: "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #0F172A;
    }
    .notice {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 28px;
    }
    .notice-title {
      font-size: 12px;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .notice-text {
      font-size: 12px;
      color: #78350F;
      line-height: 1.5;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      padding-top: 14px;
      font-size: 11px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 5.5V11.5C4 16.8 7.4 21.6 12 23C16.6 21.6 20 16.8 20 11.5V5.5L12 2Z" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
          <path d="M9 12.2L11 14.2L15.2 10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <div class="brand-title">WealthFlow</div>
        <div class="brand-sub">Two-Factor Authentication Recovery Kit</div>
      </div>
    </div>
    <div class="doc-badge">
      <span class="doc-pill">Confidential</span>
      <div class="doc-date">Generated ${escapeHtml(generatedAt)}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div>
      <div class="meta-label">Account Holder</div>
      <div class="meta-value">${safeName}</div>
    </div>
    <div>
      <div class="meta-label">Account Email</div>
      <div class="meta-value">${safeEmail}</div>
    </div>
    <div>
      <div class="meta-label">Recovery Codes</div>
      <div class="meta-value">${codes.length} Single-Use Codes</div>
    </div>
  </div>

  <div class="section-title">Emergency Recovery Codes</div>
  <div class="section-desc">
    Use any of these codes to sign in to WealthFlow if you lose access to your authenticator app. Cross out each code after using it.
  </div>

  <div class="codes-grid">
    ${codeCells}
  </div>

  <div class="notice">
    <div class="notice-title">Security Guidelines</div>
    <div class="notice-text">
      • Each code works only once. Generating a new set immediately invalidates previous backup codes.<br/>
      • Store this PDF in an encrypted password manager or print and keep it in a secure location.<br/>
      • WealthFlow support will never ask you for your recovery codes.
    </div>
  </div>

  <div class="footer">
    <span>WealthFlow Security</span>
    <span>2FA Backup Codes · Keep Private</span>
  </div>
</body>
</html>`;
}

export async function downloadBackupCodesPdf(
  params: BackupCodesPdfParams,
): Promise<void> {
  const html = buildBackupCodesHtml(params);

  if (process.env.EXPO_OS === "web") {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle: "Save WealthFlow Backup Codes",
    });
  } else {
    await Print.printAsync({ uri });
  }
}
