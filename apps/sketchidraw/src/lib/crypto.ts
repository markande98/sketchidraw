/* eslint-disable @typescript-eslint/no-explicit-any */
export class E2EEncryption {
  private key: string;
  private encoder: TextEncoder;
  private decoder: TextDecoder;
  constructor(key: string) {
    this.key = key;
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  private async deriveKey(keyString: string) {
    const keyBuffer = this.base64urlToBuffer(keyString);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16),
        iterations: 10000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  public async encrypt(data: any) {
    const cryptoKey = await this.deriveKey(this.key);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const encodedData = this.encoder.encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      encodedData
    );

    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), iv.length);

    return this.bufferToBase64url(result);
  }

  public async decrypt(encryptedData: any) {
    try {
      const cryptoKey = await this.deriveKey(this.key);
      const buffer = this.base64urlToBuffer(encryptedData);

      // Extract IV and encrypted data
      const iv = buffer.slice(0, 12);
      const encrypted = buffer.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        encrypted
      );

      const decryptedText = this.decoder.decode(decrypted);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt message");
    }
  }

  private base64urlToBuffer(base64url: string) {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const binary = atob(padded);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  private bufferToBase64url(buffer: Uint8Array<ArrayBuffer>) {
    const binary = String.fromCharCode.apply(null, Array.from(buffer));
    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}
