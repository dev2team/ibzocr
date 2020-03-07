-- *********************************************************************
-- SQL to roll back currently unexecuted changes
-- *********************************************************************
-- Change Log: src/main/resources/liquibase/master_table.xml
-- Ran at: 19-12-26 下午3:02
-- Against: IBZOCR@jdbc:h2:~/h2/last_db/ibzocr
-- Liquibase version: 3.6.3
-- *********************************************************************

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = TRUE, LOCKEDBY = 'Andy-Ryzen (10.0.75.1)', LOCKGRANTED = '2019-12-26 15:02:33.954' WHERE ID = 1 AND LOCKED = FALSE;

-- Rolling Back ChangeSet: liquibase/changelog/20191226150152.xml::1577343740990-1::hebao (generated)
DROP TABLE T_OCRRECORD;

DELETE FROM DATABASECHANGELOG WHERE ID = '1577343740990-1' AND AUTHOR = 'hebao (generated)' AND FILENAME = 'liquibase/changelog/20191226150152.xml';

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = FALSE, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1;

