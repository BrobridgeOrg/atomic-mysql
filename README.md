# atomic-mysql

A MySQL module for Atomic, compatible with Node-RED.

## Overview

`@brobridge/atomic-mysql` is a MySQL database module designed specifically for Atomic, fully compatible with the Node-RED development environment. It provides two main nodes:

- **MySQL Connection**: Configure database connection parameters.
- **MySQL Execute**: Perform SQL queries and data operations.

## Installation

```sh
npm install @brobridge/atomic-mysql
```

After installation, the module is automatically registered in the Node-RED node palette.

## MySQL Connection Node

This node is used to configure the connection to the MySQL database and can be shared across other nodes.

### Configuration Options

- **Name**: Identifier for this connection
- **Server**: MySQL host address
- **Port**: Port number (default: 3306)
- **Username / Password**: Database login credentials
- **Database**: Default database name
- **Timezone**: Timezone setting, e.g., `+00:00`
- **Charset**: Character set, e.g., `utf8mb4`
- **Max Size**: Maximum number of connections in the pool
- **Reconnect Interval**: Time interval (in milliseconds) for retrying connections

## MySQL Execute Node

This node executes SQL queries. It supports both static and dynamic SQL sources, and includes a SQL Playground for interactive testing.

### Configuration Options

- **Name**: Node name
- **Connection**: Choose a configured `MySQL Connection`
- **Output Property**: Where to store the execution result (e.g., `msg.payload`)
- **Query Source**: Determines the SQL query source:
  - `auto`: Uses `msg.query` if present; otherwise uses the built-in SQL Command.
  - `static`: Uses only the built-in SQL Command, ignoring `msg.query`.
  - `dynamic`: Uses only the SQL string provided in `msg.query`; skips execution if missing.
- **SQL Command**: Default SQL statement. You can reference properties from the Node-RED message object using `${msg.payload.xxx}`.

### Using Variables in SQL

You can insert values from the `msg` object into the SQL statement using the `${}` syntax.

Example:

```sql
SELECT * FROM users WHERE id = ${msg.payload.id}
```

## Execution Result Format

### On Success:

```js
msg.payload = {
  results: [ /* Array of query results */ ]
}
```

### On Failure:

```js
msg.error = {
  code,
  message,
  stack
}
```

## SQL Playground

The `MySQL Execute` node includes a built-in SQL Playground, allowing you to write and run SQL queries interactively.

## Example Flow: Full Data Type Coverage

The included `example.json` demonstrates a complete flow that includes:

1. Simulating input using an `inject` node
2. Processing fields using a `function` node into `msg.payloadBak`
3. Executing CREATE, INSERT, SELECT, and DROP operations with the `MySQL Execute` node
4. Observing results with a `debug` node

Refer to the `example.json` file to load and explore the complete flow.
```
[ { "id": "8b59639bfe0f4c3d", "type": "MySQL Execute", "z": "e4cc8facdef6df74", "name": "", "connection": "03e7a734a1b92b6f", "querySource": "auto", "command": "INSERT INTO all_data_types (\n col_tinyint,\n col_smallint,\n col_mediumint,\n col_int,\n col_integer,\n col_bigint,\n col_decimal,\n col_dec,\n col_numeric,\n col_fixed,\n col_float,\n col_double,\n col_double_precision,\n col_real,\n col_date,\n col_datetime,\n col_timestamp,\n col_time,\n col_year,\n col_char,\n col_varchar,\n col_binary,\n col_varbinary,\n col_blob,\n col_tinyblob,\n col_mediumblob,\n col_longblob,\n col_text,\n col_tinytext,\n col_mediumtext,\n col_longtext,\n col_enum,\n col_set,\n col_json,\n col_geometry,\n col_point,\n col_linestring,\n col_polygon,\n col_multipoint,\n col_multilinestring,\n col_multipolygon,\n col_geometrycollection\n) VALUES (\n ${msg.payloadBak.col_tinyint},\n ${msg.payloadBak.col_smallint},\n ${msg.payloadBak.col_mediumint},\n ${msg.payloadBak.col_int},\n ${msg.payloadBak.col_integer},\n ${msg.payloadBak.col_bigint},\n ${msg.payloadBak.col_decimal},\n ${msg.payloadBak.col_dec},\n ${msg.payloadBak.col_numeric},\n ${msg.payloadBak.col_fixed},\n ${msg.payloadBak.col_float},\n ${msg.payloadBak.col_double},\n ${msg.payloadBak.col_double_precision},\n ${msg.payloadBak.col_real},\n ${msg.payloadBak.col_date},\n ${msg.payloadBak.col_datetime},\n ${msg.payloadBak.col_timestamp},\n ${msg.payloadBak.col_time},\n ${msg.payloadBak.col_year},\n ${msg.payloadBak.col_char},\n ${msg.payloadBak.col_varchar},\n ${msg.payloadBak.col_binary},\n ${msg.payloadBak.col_varbinary},\n ${msg.payloadBak.col_blob},\n ${msg.payloadBak.col_tinyblob},\n ${msg.payloadBak.col_mediumblob},\n ${msg.payloadBak.col_longblob},\n ${msg.payloadBak.col_text},\n ${msg.payloadBak.col_tinytext},\n ${msg.payloadBak.col_mediumtext},\n ${msg.payloadBak.col_longtext},\n ${msg.payloadBak.col_enum},\n ${msg.payloadBak.col_set},\n ${msg.payloadBak.col_json},\n ST_GeomFromText(${msg.payloadBak.col_geometry}),\n ST_GeomFromText(${msg.payloadBak.col_point}),\n ST_GeomFromText(${msg.payloadBak.col_linestring}),\n ST_GeomFromText(${msg.payloadBak.col_polygon}),\n ST_GeomFromText(${msg.payloadBak.col_multipoint}),\n ST_GeomFromText(${msg.payloadBak.col_multilinestring}),\n ST_GeomFromText(${msg.payloadBak.col_multipolygon}),\n ST_GeomFromText(${msg.payloadBak.col_geometrycollection})\n);\n", "outputPropType": "msg", "outputProp": "payload", "x": 640, "y": 340, "wires": [ [ "fa186a346cf56b96" ] ] }, { "id": "2eaad941a77009a0", "type": "function", "z": "e4cc8facdef6df74", "name": "data process", "func": "msg.payloadBak = {\n col_tinyint: msg.payload.col_tinyint || null,\n col_smallint: msg.payload.col_smallint || null,\n col_mediumint: msg.payload.col_mediumint || null,\n col_int: msg.payload.col_int || null,\n col_integer: msg.payload.col_integer || null,\n col_bigint: msg.payload.col_bigint || null,\n col_decimal: msg.payload.col_decimal || null,\n col_dec: msg.payload.col_dec || null,\n col_numeric: msg.payload.col_numeric || null,\n col_fixed: msg.payload.col_fixed || null,\n col_float: msg.payload.col_float || null,\n col_double: msg.payload.col_double || null,\n col_double_precision: msg.payload.col_double_precision || null,\n col_real: msg.payload.col_real || null,\n col_date1: msg.payload.col_date ? new Date(msg.payload.col_date) : null,\n col_date: new Date().toISOString().slice(0, 19).replace('T', ' '),\n col_datetime1: msg.payload.col_datetime ? new Date(msg.payload.col_datetime) : null,\n col_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),\n col_timestamp1: msg.payload.col_timestamp ? new Date(msg.payload.col_timestamp) : null,\n col_timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),\n col_time1: msg.payload.col_time ? new Date(msg.payload.col_time) : null,\n col_time: new Date().toISOString().slice(0, 19).replace('T', ' '),\n col_year: msg.payload.col_year || null,\n col_char: msg.payload.col_char || null,\n col_varchar: msg.payload.col_varchar || null,\n col_binary: msg.payload.col_binary ? Buffer.from(msg.payload.col_binary, 'hex') : null,\n col_varbinary: msg.payload.col_varbinary ? Buffer.from(msg.payload.col_varbinary, 'hex') : null,\n col_blob: msg.payload.col_blob ? Buffer.from(msg.payload.col_blob, 'hex') : null,\n col_tinyblob: msg.payload.col_tinyblob ? Buffer.from(msg.payload.col_tinyblob, 'hex') : null,\n col_mediumblob: msg.payload.col_mediumblob ? Buffer.from(msg.payload.col_mediumblob, 'hex') : null,\n col_longblob: msg.payload.col_longblob ? Buffer.from(msg.payload.col_longblob, 'hex') : null,\n col_text: msg.payload.col_text || null,\n col_tinytext: msg.payload.col_tinytext || null,\n col_mediumtext: msg.payload.col_mediumtext || null,\n col_longtext: msg.payload.col_longtext || null,\n col_enum: msg.payload.col_enum || null,\n col_set: msg.payload.col_set || null,\n col_json: msg.payload.col_json || null,\n col_geometry: msg.payload.col_geometry || null,\n col_point: msg.payload.col_point || null,\n col_linestring: msg.payload.col_linestring || null,\n col_polygon: msg.payload.col_polygon || null,\n col_multipoint: msg.payload.col_multipoint || null,\n col_multilinestring: msg.payload.col_multilinestring || null,\n col_multipolygon: msg.payload.col_multipolygon || null,\n col_geometrycollection: msg.payload.col_geometrycollection || null,\n};\nreturn msg;\n", "outputs": 1, "timeout": 0, "noerr": 0, "initialize": "", "finalize": "", "libs": [], "x": 410, "y": 340, "wires": [ [ "8b59639bfe0f4c3d" ] ] }, { "id": "8f933c5e7d9a7d3a", "type": "inject", "z": "e4cc8facdef6df74", "name": "Insert", "props": [ { "p": "payload" }, { "p": "topic", "vt": "str" } ], "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "{\"col_tinyint\":75,\"col_smallint\":2575,\"col_mediumint\":4640552,\"col_int\":917793014,\"col_integer\":1009064231,\"col_bigint\":1139026116863759100,\"col_decimal\":25266.16044,\"col_dec\":20552.39025,\"col_numeric\":87777.93907,\"col_fixed\":65824.96203,\"col_float\":18970.19217,\"col_double\":12720.27281,\"col_double_precision\":48528.08791,\"col_real\":19520.87148,\"col_date\":\"2024-08-05\",\"col_datetime\":\"2024-08-05 12:34:56\",\"col_timestamp\":\"2024-08-05 12:34:56\",\"col_time\":\"12:34:56\",\"col_year\":2024,\"col_char\":\"X\",\"col_varchar\":\"Fake varchar data\",\"col_binary\":\"66616B652062696E617279\",\"col_varbinary\":\"66616B652076617262696E617279\",\"col_blob\":\"626C6F62\",\"col_tinyblob\":\"74696E79\",\"col_mediumblob\":\"6D656469756D\",\"col_longblob\":\"6C6F6E67\",\"col_text\":\"some text\",\"col_tinytext\":\"tiny text\",\"col_mediumtext\":\"medium text content\",\"col_longtext\":\"very long text content here\",\"col_enum\":\"value1\",\"col_set\":\"value1,value2\",\"col_json\":\"{\\\"example\\\": \\\"value\\\"}\",\"col_geometry\":\"POINT(1 1)\",\"col_point\":\"POINT(1 1)\",\"col_linestring\":\"LINESTRING(0 0, 1 1)\",\"col_polygon\":\"POLYGON((0 0, 1 1, 1 0, 0 0))\",\"col_multipoint\":\"MULTIPOINT((0 0), (1 1))\",\"col_multilinestring\":\"MULTILINESTRING((0 0, 1 1), (1 1, 2 2))\",\"col_multipolygon\":\"MULTIPOLYGON(((0 0, 1 1, 1 0, 0 0)), ((2 2, 3 3, 3 2, 2 2)))\",\"col_geometrycollection\":\"GEOMETRYCOLLECTION(POINT(1 1), LINESTRING(0 0, 1 1))\"}", "payloadType": "json", "x": 150, "y": 340, "wires": [ [ "2eaad941a77009a0" ] ] }, { "id": "fa186a346cf56b96", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 5", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "payload", "targetType": "msg", "statusVal": "", "statusType": "auto", "x": 880, "y": 340, "wires": [] }, { "id": "285bc61850b04e6b", "type": "MySQL Execute", "z": "e4cc8facdef6df74", "name": "", "connection": "03e7a734a1b92b6f", "querySource": "auto", "command": "CREATE TABLE all_data_types (\n -- Numeric Data Types\n col_tinyint TINYINT,\n col_smallint SMALLINT,\n col_mediumint MEDIUMINT,\n col_int INT,\n col_integer INTEGER,\n col_bigint BIGINT,\n col_decimal DECIMAL(10,2),\n col_dec DECIMAL(10,2),\n col_numeric NUMERIC(10,2),\n col_fixed DECIMAL(10,2),\n col_float FLOAT,\n col_double DOUBLE,\n col_double_precision DOUBLE PRECISION,\n col_real REAL,\n\n -- Date and Time Data Types\n col_date DATE,\n col_datetime DATETIME,\n col_timestamp TIMESTAMP,\n col_time TIME,\n col_year YEAR,\n\n -- String Data Types\n col_char CHAR(50),\n col_varchar VARCHAR(50),\n col_binary BINARY(50),\n col_varbinary VARBINARY(50),\n col_blob BLOB,\n col_tinyblob TINYBLOB,\n col_mediumblob MEDIUMBLOB,\n col_longblob LONGBLOB,\n col_text TEXT,\n col_tinytext TINYTEXT,\n col_mediumtext MEDIUMTEXT,\n col_longtext LONGTEXT,\n col_enum ENUM('value1', 'value2', 'value3'),\n col_set SET('value1', 'value2', 'value3'),\n\n -- JSON Data Type\n col_json JSON,\n\n -- Spatial Data Types\n col_geometry GEOMETRY,\n col_point POINT,\n col_linestring LINESTRING,\n col_polygon POLYGON,\n col_multipoint MULTIPOINT,\n col_multilinestring MULTILINESTRING,\n col_multipolygon MULTIPOLYGON,\n col_geometrycollection GEOMETRYCOLLECTION\n)\n", "outputPropType": "msg", "outputProp": "payload", "x": 640, "y": 60, "wires": [ [ "1b9c5e86db35fb0b" ] ] }, { "id": "20e641420e0fbe48", "type": "inject", "z": "e4cc8facdef6df74", "name": "Create table", "props": [ { "p": "payload" }, { "p": "topic", "vt": "str" } ], "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "{\"col_tinyint\":75,\"col_smallint\":2575,\"col_mediumint\":4640552,\"col_int\":917793014,\"col_integer\":1009064231,\"col_bigint\":1139026116863759100,\"col_decimal\":25266.16044,\"col_dec\":20552.39025,\"col_numeric\":87777.93907,\"col_fixed\":65824.96203,\"col_float\":18970.19217,\"col_double\":12720.27281,\"col_double_precision\":48528.08791,\"col_real\":19520.87148,\"col_date\":\"2024-08-05\",\"col_datetime\":\"2024-08-05 12:34:56\",\"col_timestamp\":\"2024-08-05 12:34:56\",\"col_time\":\"12:34:56\",\"col_year\":2024,\"col_char\":\"X\",\"col_varchar\":\"Fake varchar data\",\"col_binary\":\"66616B652062696E617279\",\"col_varbinary\":\"66616B652076617262696E617279\",\"col_blob\":\"626C6F62\",\"col_tinyblob\":\"74696E79\",\"col_mediumblob\":\"6D656469756D\",\"col_longblob\":\"6C6F6E67\",\"col_text\":\"some text\",\"col_tinytext\":\"tiny text\",\"col_mediumtext\":\"medium text content\",\"col_longtext\":\"very long text content here\",\"col_enum\":\"value1\",\"col_set\":\"value1,value2\",\"col_json\":\"{\\\"example\\\": \\\"value\\\"}\",\"col_geometry\":\"POINT(1 1)\",\"col_point\":\"POINT(1 1)\",\"col_linestring\":\"LINESTRING(0 0, 1 1)\",\"col_polygon\":\"POLYGON((0 0, 1 1, 1 0, 0 0))\",\"col_multipoint\":\"MULTIPOINT((0 0), (1 1))\",\"col_multilinestring\":\"MULTILINESTRING((0 0, 1 1), (1 1, 2 2))\",\"col_multipolygon\":\"MULTIPOLYGON(((0 0, 1 1, 1 0, 0 0)), ((2 2, 3 3, 3 2, 2 2)))\",\"col_geometrycollection\":\"GEOMETRYCOLLECTION(POINT(1 1), LINESTRING(0 0, 1 1))\"}", "payloadType": "json", "x": 170, "y": 60, "wires": [ [ "285bc61850b04e6b" ] ] }, { "id": "1b9c5e86db35fb0b", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 1", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "payload", "targetType": "msg", "statusVal": "", "statusType": "auto", "x": 880, "y": 60, "wires": [] }, { "id": "0d1d9184fce0a5cd", "type": "catch", "z": "e4cc8facdef6df74", "name": "", "scope": [ "285bc61850b04e6b" ], "uncaught": false, "x": 630, "y": 120, "wires": [ [ "f66cef51e07c9844" ] ] }, { "id": "f66cef51e07c9844", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 2", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "true", "targetType": "full", "statusVal": "", "statusType": "auto", "x": 880, "y": 120, "wires": [] }, { "id": "38c6d36a11b44eb8", "type": "MySQL Execute", "z": "e4cc8facdef6df74", "name": "", "connection": "03e7a734a1b92b6f", "querySource": "auto", "command": "DROP TABLE all_data_types", "outputPropType": "msg", "outputProp": "payload", "x": 640, "y": 200, "wires": [ [ "5e9b8f5a71fa935d" ] ] }, { "id": "daa2b80439d55512", "type": "inject", "z": "e4cc8facdef6df74", "name": "Drop table", "props": [ { "p": "payload" }, { "p": "topic", "vt": "str" } ], "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "{\"col_tinyint\":75,\"col_smallint\":2575,\"col_mediumint\":4640552,\"col_int\":917793014,\"col_integer\":1009064231,\"col_bigint\":1139026116863759100,\"col_decimal\":25266.16044,\"col_dec\":20552.39025,\"col_numeric\":87777.93907,\"col_fixed\":65824.96203,\"col_float\":18970.19217,\"col_double\":12720.27281,\"col_double_precision\":48528.08791,\"col_real\":19520.87148,\"col_date\":\"2024-08-05\",\"col_datetime\":\"2024-08-05 12:34:56\",\"col_timestamp\":\"2024-08-05 12:34:56\",\"col_time\":\"12:34:56\",\"col_year\":2024,\"col_char\":\"X\",\"col_varchar\":\"Fake varchar data\",\"col_binary\":\"66616B652062696E617279\",\"col_varbinary\":\"66616B652076617262696E617279\",\"col_blob\":\"626C6F62\",\"col_tinyblob\":\"74696E79\",\"col_mediumblob\":\"6D656469756D\",\"col_longblob\":\"6C6F6E67\",\"col_text\":\"some text\",\"col_tinytext\":\"tiny text\",\"col_mediumtext\":\"medium text content\",\"col_longtext\":\"very long text content here\",\"col_enum\":\"value1\",\"col_set\":\"value1,value2\",\"col_json\":\"{\\\"example\\\": \\\"value\\\"}\",\"col_geometry\":\"POINT(1 1)\",\"col_point\":\"POINT(1 1)\",\"col_linestring\":\"LINESTRING(0 0, 1 1)\",\"col_polygon\":\"POLYGON((0 0, 1 1, 1 0, 0 0))\",\"col_multipoint\":\"MULTIPOINT((0 0), (1 1))\",\"col_multilinestring\":\"MULTILINESTRING((0 0, 1 1), (1 1, 2 2))\",\"col_multipolygon\":\"MULTIPOLYGON(((0 0, 1 1, 1 0, 0 0)), ((2 2, 3 3, 3 2, 2 2)))\",\"col_geometrycollection\":\"GEOMETRYCOLLECTION(POINT(1 1), LINESTRING(0 0, 1 1))\"}", "payloadType": "json", "x": 160, "y": 200, "wires": [ [ "38c6d36a11b44eb8" ] ] }, { "id": "5e9b8f5a71fa935d", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 3", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "payload", "targetType": "msg", "statusVal": "", "statusType": "auto", "x": 880, "y": 200, "wires": [] }, { "id": "cd0bbccbe0302329", "type": "catch", "z": "e4cc8facdef6df74", "name": "", "scope": [ "38c6d36a11b44eb8" ], "uncaught": false, "x": 630, "y": 260, "wires": [ [ "befdafd7683343f1" ] ] }, { "id": "befdafd7683343f1", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 4", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "true", "targetType": "full", "statusVal": "", "statusType": "auto", "x": 880, "y": 260, "wires": [] }, { "id": "94ca94f4eb339e1d", "type": "MySQL Execute", "z": "e4cc8facdef6df74", "name": "", "connection": "03e7a734a1b92b6f", "querySource": "auto", "command": "select apis.js client examples LICENSE mysql-connection.html mysql-connection.js mysql-execute.html mysql-execute.js node_modules package.json package-lock.json README.md resources usage.md from all_data_types", "outputPropType": "msg", "outputProp": "payload", "x": 640, "y": 480, "wires": [ [ "e0ac241e8e0edd2e" ] ] }, { "id": "d6e0cc96dbbe6f65", "type": "inject", "z": "e4cc8facdef6df74", "name": "Select", "props": [ { "p": "payload" }, { "p": "topic", "vt": "str" } ], "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "", "payloadType": "date", "x": 150, "y": 480, "wires": [ [ "94ca94f4eb339e1d" ] ] }, { "id": "e0ac241e8e0edd2e", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 7", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "payload", "targetType": "msg", "statusVal": "", "statusType": "auto", "x": 880, "y": 480, "wires": [] }, { "id": "ac5a24a08077d998", "type": "catch", "z": "e4cc8facdef6df74", "name": "", "scope": [ "8b59639bfe0f4c3d" ], "uncaught": false, "x": 630, "y": 400, "wires": [ [ "719e4af3915a470d" ] ] }, { "id": "719e4af3915a470d", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 6", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "true", "targetType": "full", "statusVal": "", "statusType": "auto", "x": 880, "y": 400, "wires": [] }, { "id": "26a37c53ffa04a88", "type": "catch", "z": "e4cc8facdef6df74", "name": "", "scope": [ "94ca94f4eb339e1d" ], "uncaught": false, "x": 630, "y": 540, "wires": [ [ "1a186041079aa99e" ] ] }, { "id": "1a186041079aa99e", "type": "debug", "z": "e4cc8facdef6df74", "name": "debug 8", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "true", "targetType": "full", "statusVal": "", "statusType": "auto", "x": 880, "y": 540, "wires": [] }, { "id": "03e7a734a1b92b6f", "type": "MySQL Connection", "name": "mysql server", "server": "172.17.0.1", "port": 3306, "database": "gravity", "timezone": "+00:00", "charset": "utf8mb4", "poolMax": "10", "connectionRetryInterval": 3000 } ]
```

## Commercial Support

Brobridge provides the customer service which contains comprehensive technical and commercial support for the module.

## License

This module is licensed under the Apache License.

## Authors

Copyright(c) 2025 Jhe Sue <<jhe@brobridge.com>>
