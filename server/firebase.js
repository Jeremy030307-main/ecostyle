// firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';

serviceAccount = {
  "type": "service_account",
  "project_id": "ecostyle-f6ae5",
  "private_key_id": "4f37483f95288c34b1815fb04a372f0b252160ba",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeyjipgUlgpwnc\nmsxNhMTg14/GUbDge2GrzjLp1W9HyTAwBPytZpLy6RLWN3pyyUc2ekvO7docXLHu\nWSKeo7W3YPhuNrh5hMLoZhr20U9t94Ihy3CDOP3uciLgMWd8CgILcHQpCwU3DHPc\nwjnBxLxvh7K2Mdikbe+Et8yTZbdQe8fcDFz5qTkFvkhrRKmNsbPhiGKCwq+iWmog\nxApm04xGLnQ8nJK4K2OAqthGB/4yy4FwSw3qudaB5HB9lMQBNMg81qsDe5dyJDve\ntKW17IvjmV3fFpuhFJ0ct0bCGiKO5eGAI3gUPV3Yf2DPO/P3PflYrwTTjd/jXMsW\nMrNKPx4TAgMBAAECggEAPioa/rk/udgLM1Ni8mItFX0uq0xl+6wx86nZItRNKYRp\nGhOJvHTwyKpYlobHqFKGT5yXOx7BCeN8QTyiIgsjY/RRrgw8Mk64Y3U9zyzodLu2\nNXbIyIayWvxSDQUqZ1QfsszGnR7UXtXAMkfThrl3sA4m988R6mWjpIi0TWw/1QDS\nhvN9/DOp9LboDuCBDaX9CkrnRTuhtps110ycwzB1+xe1P4JRc9ClHSMOg0cp1s6r\n0e6eRjxv9wqYlbwvA3ddUaQMTsT69A4XnFU+wUr17Q09dhCbTCQlqQKUQlSdlmzb\nraWnJWewfXj+q9O+awGED3ILeFiRhF8A+jTC7lcSiQKBgQDU6yFkDvpJxucaArO1\n3CbseI25bE+jyazIbjXcSvf7UZedmFc3ZSufL3ERLYt9F7e7SkSi+8qRbhVWh8Ig\nI+6qz14RqFowMnq6AlbFTMQF9zHAwY7/1zjkmPKjV2f9/dVu9vgkhC25u0jqcnlQ\nOUPhsijry9gJjP4U5+yTpCDtTwKBgQC+609mPIO/xwI82TW0rqsHvngny1FSaCtl\nqoI+/kLniYAyCThyJF83DdL1zF564ULId6OTYn2ASm6HuPh6dcVDlSYpwZwDWcsi\nv5J/oYFz9A5Y7JP6NfaQH4JLGrSJz5IT5scKscSHhCODWu4j61EO3tPQyX0Lih6Z\n1O95pcI5/QKBgEcqZBm+i9e2/K2L86c4c2YckTpFwoS7Nt4zQBtmj2ZYCjYpohUo\n4qCtSbx1HadtEwMtuq1DPZzIT6eBbtgxSmebMhTy0VpEtRKRD5GYq/hWfDGyQGqw\n9BosKQWBhIe3nOwe7ie+ak4nFCMQqg2vZkn8s4LEumvOzWoNbtyWQk8vAoGARppm\npnxCjK1f2njJL6RYg2igrra1wC/dvJ8tw3Xr8AwdaGOYiD2DKKzoExYc6nxbYh88\nUsjdeJAOCAsTeNYMuU1y64Y519NhF9yYpLJpWSQsGh6DKsjCAdJlMLkTgtNMRifV\n+9J5x1PKfk0mPApN05373v5kS9wsLN9eIDJ4fVECgYEAxtKLpkS1vuRtG3BaFvHj\neOoRUNVJ6x8w3zSjfNS14O2UKAnHFHIDu+Voba4/yCbK2T//yMo3Q5uSFSoYjMaj\nY1pYZiRnkU0a9xKp2KzBheQZftT+AVRoGBJN+3h5Ka7Hr+vYHcpBrRUDS/Qnh7np\nNn0WRfL0c+KoPzCj1St8vAQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-usabu@ecostyle-f6ae5.iam.gserviceaccount.com",
  "client_id": "110002620880778723016",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-usabu%40ecostyle-f6ae5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

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


