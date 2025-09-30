#!/bin/bash

# MySQL Backup Script using mysqldump + Resend API
# > chmod +x backup_script.sh
# > crontab -e
# 0 4 * * * /path/to/backup_script.sh >> /var/log/mysql_backup.log 2>&1

# Configuration
MYSQL_USER=""
MYSQL_PASS=""
MYSQL_HOST=""
MYSQL_PORT="3306"

RESEND_API_KEY=""
FROM_EMAIL=""
TO_EMAIL=""

BACKUP_DIR="/tmp/mysql_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="mysql_backup_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get databases (exclude system databases)
DATABASES=$(mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASS" -e "SHOW DATABASES;" -sN 2>/dev/null | grep -Ev "^(information_schema|performance_schema|mysql|sys)$")

if [ -z "$DATABASES" ]; then
    echo "ERROR [User: $MYSQL_USER]: No databases found or connection failed" >&2
    exit 1
fi

# Create backup
mysqldump -h"$MYSQL_HOST" \
          -P"$MYSQL_PORT" \
          -u"$MYSQL_USER" \
          -p"$MYSQL_PASS" \
          --databases $DATABASES \
          --single-transaction \
          --quick \
          --lock-tables=false \
          --routines \
          --triggers \
          --events \
          --skip-column-statistics \
          2>/dev/null | gzip > "$BACKUP_PATH"

if [ ! -f "$BACKUP_PATH" ]; then
    echo "ERROR [User: $MYSQL_USER]: Backup failed" >&2
    exit 1
fi

# Send via Resend API
FILESIZE=$(du -h "$BACKUP_PATH" | cut -f1)
BASE64_CONTENT=$(base64 -w 0 "$BACKUP_PATH" 2>/dev/null || base64 "$BACKUP_PATH")

HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer ${RESEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"${FROM_EMAIL}\",
    \"to\": [\"${TO_EMAIL}\"],
    \"subject\": \"Daily Backup: 📈 KeepWorking DB\",
    \"text\": \"Attached is the daily backup of your KeepWorking database.\",
    \"attachments\": [{
      \"filename\": \"${BACKUP_FILE}\",
      \"content\": \"${BASE64_CONTENT}\"
    }]
  }")

if [ "$HTTP_CODE" -ne 200 ]; then
    echo "ERROR [User: $MYSQL_USER]: Email send failed (HTTP $HTTP_CODE)" >&2
    exit 1
fi

# Cleanup old backups (7+ days)
find "$BACKUP_DIR" -name "mysql_backup_*.sql.gz" -mtime +7 -delete

exit 0