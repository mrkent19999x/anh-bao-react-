const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const xml2js = require('xml2js');
const crypto = require('crypto');

admin.initializeApp();

// XMLGuard Functions
exports.validateXml = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify Firebase token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Missing Firebase token'
        });
      }

      const idToken = authHeader.split('Bearer ')[1];
      try {
        await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Invalid Firebase token'
        });
      }

      // Handle XML validation
      if (req.method !== 'POST') {
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
      }

      let xmlContent = '';
      let fileName = '';

      // Handle file upload or content
      if (req.body && req.body.content) {
        xmlContent = req.body.content;
        fileName = 'content.xml';
      } else if (req.files && req.files.file) {
        xmlContent = req.files.file.data.toString('utf8');
        fileName = req.files.file.name;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No XML content provided'
        });
      }

      // Parse XML
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true
      });

      let xmlData;
      try {
        xmlData = await parser.parseStringPromise(xmlContent);
      } catch (error) {
        return res.json({
          success: false,
          message: 'Invalid XML format',
          error: error.message
        });
      }

      // Extract XML information
      const result = extractXmlInfo(xmlData, xmlContent);
      
      // Log to Firestore
      await logXmlValidation(req, result, fileName);

      res.json({
        success: true,
        ok: result.isValid,
        checksum: result.checksum,
        fingerprint: result.fingerprint,
        issues: result.issues,
        fileName: fileName,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('XMLGuard validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
});

// Extract XML information
function extractXmlInfo(xmlData, xmlContent) {
  const issues = [];
  const fingerprint = {};
  
  try {
    // Calculate checksum
    const checksum = crypto.createHash('md5').update(xmlContent).digest('hex');
    
    // Extract common tax XML fields
    const root = xmlData[Object.keys(xmlData)[0]];
    
    // MST (Mã số thuế)
    if (root.mst) {
      fingerprint.mst = root.mst;
    } else if (root.MST) {
      fingerprint.mst = root.MST;
    } else {
      issues.push('Missing MST (Mã số thuế)');
    }
    
    // FormCode (Mã mẫu hóa đơn)
    if (root.formCode) {
      fingerprint.formCode = root.formCode;
    } else if (root.FormCode) {
      fingerprint.formCode = root.FormCode;
    } else if (root.maMau) {
      fingerprint.formCode = root.maMau;
    }
    
    // Period (Kỳ kê khai)
    if (root.period) {
      fingerprint.period = root.period;
    } else if (root.Period) {
      fingerprint.period = root.Period;
    } else if (root.kyKhai) {
      fingerprint.period = root.kyKhai;
    }
    
    // Amount fields
    const amountFields = ['amount', 'Amount', 'soTien', 'tongTien'];
    for (const field of amountFields) {
      if (root[field]) {
        fingerprint.amount = root[field];
        break;
      }
    }
    
    // Additional fields
    if (root.maTKhai) fingerprint.maTKhai = root.maTKhai;
    if (root.kieuKy) fingerprint.kieuKy = root.kieuKy;
    if (root.soLan) fingerprint.soLan = root.soLan;
    
    // Check for suspicious patterns
    if (xmlContent.includes('fake') || xmlContent.includes('test')) {
      issues.push('Suspicious content detected');
    }
    
    // Check XML structure
    if (!fingerprint.mst) {
      issues.push('Invalid XML structure - Missing required fields');
    }
    
    const isValid = issues.length === 0;
    
    return {
      isValid,
      checksum,
      fingerprint,
      issues,
      xmlSize: xmlContent.length
    };
    
  } catch (error) {
    return {
      isValid: false,
      checksum: '',
      fingerprint: {},
      issues: ['XML parsing error: ' + error.message],
      xmlSize: xmlContent.length
    };
  }
}

// Log validation to Firestore
async function logXmlValidation(req, result, fileName) {
  try {
    const logData = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      fileName: fileName,
      isValid: result.isValid,
      checksum: result.checksum,
      fingerprint: result.fingerprint,
      issues: result.issues,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    };
    
    await admin.firestore().collection('xmlguard_logs').add(logData);
  } catch (error) {
    console.error('Failed to log XML validation:', error);
  }
}

// Health check endpoint
exports.xmlguardStatus = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.json({
      success: true,
      service: 'XMLGuard Firebase Functions',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });
});
