// firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = {
  "type": "service_account",
  "project_id": "ecostyle-f6ae5",
  "private_key_id": "0b1c2c17bbe4feb9026e39e5630d8bb3b2745858",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDiyGxLAfGy4Dt7\nqZiwdlP3e5mXUvTgagY4n8RzC/ld+LF8TdGcYRFQQJR5TbRDNTMKx2V9zaQnXupc\noXg+aDeg3u5ly70ekL1OUJvK+Q2P8EAGcIrapRCoK8VY77jfQUdCLwJGSrnGjv+s\nntuc37sVqRU0qlb9vt6mXXhDEeAIjaUPIRT2/Mn9YJ23pE68XpZpYt3nuvq2AL2R\nl+cOnVh+XqzP2stCxXQ9KZoo71f1QvEJPPmLIgoYd4YA8DRKnb2D9L+ZNjHWusMM\nP13BP3pIMVNhI1MGNQVvEmpnMKKwTU5ZZbHxjh71QYKdAfxjQB4YKR7E6GMowFBx\nAPgQP3/TAgMBAAECggEAGHQ0hTQM9tUKD6Vz3aysv4t4Pjfc8ulL3sWPk+OZ0fcU\nAGDjIOHbUZQyeRAWx4Z63gcum6MAjURFW5QHw3Gjyfjaq7ximg37yRrqabfIWBni\ndYSjhxHJ2tskGRkkY2KGcg21SOocNTEh7bW63aQcaCixgi/PWJDr2570QwXa6rZT\nYmLf9Us84mEZ9DIHygIMkhwLx6uJ4WndN0vAMWCpWEJMTX12UxU3UutNtiO0vCX3\n+Vh3FCmhyoEJSa1up3p4zsbCT8h2kcYfjYyN45JCnj4nqTteqeBE3nT5AQOTwJdg\nnJzdGJUeq7/0/wRdqvSoKrhKKEzIvruf3A1dZWOxgQKBgQD3TcKwwXzgajvmHSZc\nsQe/FtaMFWX5Y+8+ZEQWcg6m3oerQXUMxn2cS6KtvzECDx30NDbVB6UDS0dGOMWL\nAz+uopLQ4+b8kzg6qUlcIJciUKQTJv7sZpZoVay70q5iFWC1ApUFpMO9ukmEf5/R\nSKzZ1NXlji+0seh1o0P0fLewgQKBgQDqwe7ShZNAGfBzI3SR1Xcxlz7kOCmion4H\nqDfAp9QtsZpz7AZecBPCtdvixF1ezDMZXdHoeiosoloaboAa9r+3yQAVgqTf8aUt\nPJ/YmoYm4yWZ2OM0ZmK5VC9YU9lp2pwu1hm+mIfGpgXPT/KAnubJSadwts+igll6\nfdpUD25GUwKBgCa3UceCQx6PAxmfbqYMQP41gRklMHW+o3HNGKu653hQVkUFVmHN\noVSasrkouW9tFm9ozTzEmZzOaDYiJSsCMzIP2ZRCWaMpGSB16Do4D/EbVtR4wmgY\nF2v2Hbi53vsUBbPQ16uug8ZsJ55KrKaDDix8GZB6lhVf1Ni12qmn7MoBAoGAWQ26\naBgN1OpCIZtYlB3TOneyfuajPLPBdWwlwiqoPbE68zCc9eQ0Ss+sGyj8doKl+8Bw\naW02ZHouDgrPA+uIrNJN+tr1apKDY1a1GHj93PCcCfGRtwYD+2PpFeuw9Qvd5ZKI\nb5nzH7NJTux4BLzCtacAIqzmtTIXeXUWhn7YCUsCgYBQfyAGz1MdeDKfOYIgbqtA\nxU6y3uPWjOFZP2gbmhQBEAohpGl8aimqHJzyQ8tjWYIHY36TcNIGgn42zjsKqE0X\nOlnI2FsNX+egeO/fK3/RMjWhOrLkKXxBs+RKMQyikXGiiyc4MenCyiOVen4B7kBo\nefFEXeC20WeZ3pBA47NyXQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-usabu@ecostyle-f6ae5.iam.gserviceaccount.com",
  "client_id": "110002620880778723016",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-usabu%40ecostyle-f6ae5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Optionally, add projectId if needed
    // projectId: 'ecostyle-f6ae5',
  });
}

const db = admin.firestore();


// Export the db (Firestore) and any other services you may need
export { db };


