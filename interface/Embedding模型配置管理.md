---
title: AI知识库
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.29"

---

# AI知识库

Base URLs:

* <a href="http://localhost:8080">开发环境: http://localhost:8080</a>

# Authentication

- HTTP Authentication, scheme: bearer

# PC/Embedding模型配置管理

<a id="opIdgetById_6"></a>

## GET 获取Embedding模型配置详情

GET /api/v1/embedding/config/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |配置ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "modelType": "string",
    "apiKey": "string",
    "baseUrl": "string",
    "dimensions": 0,
    "enabled": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "creatorName": "string",
    "updaterName": "string",
    "remark": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[REmbeddingConfigVO](#schemarembeddingconfigvo)|

<a id="opIdupdate_6"></a>

## PUT 更新Embedding模型配置

PUT /api/v1/embedding/config/{id}

> Body 请求参数

```json
{
  "name": "string",
  "modelType": "string",
  "apiKey": "string",
  "baseUrl": "string",
  "dimensions": 0,
  "enabled": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |配置ID|
|body|body|[EmbeddingConfigDTO](#schemaembeddingconfigdto)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "modelType": "string",
    "apiKey": "string",
    "baseUrl": "string",
    "dimensions": 0,
    "enabled": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "creatorName": "string",
    "updaterName": "string",
    "remark": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[REmbeddingConfigVO](#schemarembeddingconfigvo)|

<a id="opIddelete_6"></a>

## DELETE 删除Embedding模型配置

DELETE /api/v1/embedding/config/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |配置ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RVoid](#schemarvoid)|

<a id="opIdcreate_4"></a>

## POST 创建Embedding模型配置

POST /api/v1/embedding/config

> Body 请求参数

```json
{
  "name": "string",
  "modelType": "string",
  "apiKey": "string",
  "baseUrl": "string",
  "dimensions": 0,
  "enabled": 0,
  "remark": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[EmbeddingConfigDTO](#schemaembeddingconfigdto)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "modelType": "string",
    "apiKey": "string",
    "baseUrl": "string",
    "dimensions": 0,
    "enabled": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "creatorName": "string",
    "updaterName": "string",
    "remark": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[REmbeddingConfigVO](#schemarembeddingconfigvo)|

<a id="opIdlist_4"></a>

## GET 分页查询Embedding模型配置列表

GET /api/v1/embedding/config/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|records|query|array[object]| 否 |none|
|total|query|integer(int64)| 否 |none|
|size|query|integer(int64)| 否 |none|
|current|query|integer(int64)| 否 |none|
|orders|query|array[object]| 否 |none|
|optimizeCountSql|query|[PageEmbeddingConfig](#schemapageembeddingconfig)| 否 |none|
|searchCount|query|[PageEmbeddingConfig](#schemapageembeddingconfig)| 否 |none|
|optimizeJoinOfCountSql|query|boolean| 否 |none|
|maxLimit|query|integer(int64)| 否 |none|
|countId|query|string| 否 |none|
|pages|query|integer(int64)| 否 |none|
|name|query|string| 否 |模型名称|
|enabled|query|integer(int32)| 否 |是否启用|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorName": "string",
        "updaterName": "string",
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "pages": 0
      },
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "pages": 0
      },
      "pages": 0
    },
    "pages": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RPageEmbeddingConfigVO](#schemarpageembeddingconfigvo)|

<a id="opIdgetEnabledConfig"></a>

## GET 获取启用的Embedding模型配置

GET /api/v1/embedding/config/enabled

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "modelType": "string",
    "apiKey": "string",
    "baseUrl": "string",
    "dimensions": 0,
    "enabled": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "creatorName": "string",
    "updaterName": "string",
    "remark": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[REmbeddingConfigVO](#schemarembeddingconfigvo)|

# 数据模型

<h2 id="tocS_RVoid">RVoid</h2>

<a id="schemarvoid"></a>
<a id="schema_RVoid"></a>
<a id="tocSrvoid"></a>
<a id="tocsrvoid"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {}
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|object|false|none||none|

<h2 id="tocS_EmbeddingConfigDTO">EmbeddingConfigDTO</h2>

<a id="schemaembeddingconfigdto"></a>
<a id="schema_EmbeddingConfigDTO"></a>
<a id="tocSembeddingconfigdto"></a>
<a id="tocsembeddingconfigdto"></a>

```json
{
  "name": "string",
  "modelType": "string",
  "apiKey": "string",
  "baseUrl": "string",
  "dimensions": 0,
  "enabled": 0,
  "remark": "string"
}

```

Embedding模型配置DTO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|name|string|true|none||模型名称|
|modelType|string|true|none||模型类型|
|apiKey|string|true|none||API密钥|
|baseUrl|string|true|none||API基础URL|
|dimensions|integer(int32)|true|none||模型维度|
|enabled|integer(int32)|true|none||是否启用|
|remark|string|false|none||备注|

<h2 id="tocS_OrderItem">OrderItem</h2>

<a id="schemaorderitem"></a>
<a id="schema_OrderItem"></a>
<a id="tocSorderitem"></a>
<a id="tocsorderitem"></a>

```json
{
  "column": "string",
  "asc": true
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|column|string|false|none||none|
|asc|boolean|false|none||none|

<h2 id="tocS_EmbeddingConfigVO">EmbeddingConfigVO</h2>

<a id="schemaembeddingconfigvo"></a>
<a id="schema_EmbeddingConfigVO"></a>
<a id="tocSembeddingconfigvo"></a>
<a id="tocsembeddingconfigvo"></a>

```json
{
  "id": 0,
  "name": "string",
  "modelType": "string",
  "apiKey": "string",
  "baseUrl": "string",
  "dimensions": 0,
  "enabled": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "creatorName": "string",
  "updaterName": "string",
  "remark": "string"
}

```

Embedding模型配置VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||主键ID|
|name|string|false|none||模型名称|
|modelType|string|false|none||模型类型|
|apiKey|string|false|none||API密钥|
|baseUrl|string|false|none||API基础URL|
|dimensions|integer(int32)|false|none||模型维度|
|enabled|integer(int32)|false|none||是否启用|
|createTime|string(date-time)|false|none||创建时间|
|updateTime|string(date-time)|false|none||更新时间|
|creatorName|string|false|none||创建者名称|
|updaterName|string|false|none||更新者名称|
|remark|string|false|none||备注|

<h2 id="tocS_REmbeddingConfigVO">REmbeddingConfigVO</h2>

<a id="schemarembeddingconfigvo"></a>
<a id="schema_REmbeddingConfigVO"></a>
<a id="tocSrembeddingconfigvo"></a>
<a id="tocsrembeddingconfigvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "modelType": "string",
    "apiKey": "string",
    "baseUrl": "string",
    "dimensions": 0,
    "enabled": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "creatorName": "string",
    "updaterName": "string",
    "remark": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[EmbeddingConfigVO](#schemaembeddingconfigvo)|false|none||Embedding模型配置VO|

<h2 id="tocS_PageEmbeddingConfigVO">PageEmbeddingConfigVO</h2>

<a id="schemapageembeddingconfigvo"></a>
<a id="schema_PageEmbeddingConfigVO"></a>
<a id="tocSpageembeddingconfigvo"></a>
<a id="tocspageembeddingconfigvo"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "modelType": "string",
      "apiKey": "string",
      "baseUrl": "string",
      "dimensions": 0,
      "enabled": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "creatorName": "string",
      "updaterName": "string",
      "remark": "string"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "orders": [
    {
      "column": "string",
      "asc": true
    }
  ],
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorName": "string",
        "updaterName": "string",
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorName": "string",
        "updaterName": "string",
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "optimizeJoinOfCountSql": true,
  "maxLimit": 0,
  "countId": "string",
  "pages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|records|[[EmbeddingConfigVO](#schemaembeddingconfigvo)]|false|none||[Embedding模型配置VO]|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageEmbeddingConfigVO](#schemapageembeddingconfigvo)|false|none||none|
|searchCount|[PageEmbeddingConfigVO](#schemapageembeddingconfigvo)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_RPageEmbeddingConfigVO">RPageEmbeddingConfigVO</h2>

<a id="schemarpageembeddingconfigvo"></a>
<a id="schema_RPageEmbeddingConfigVO"></a>
<a id="tocSrpageembeddingconfigvo"></a>
<a id="tocsrpageembeddingconfigvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorName": "string",
        "updaterName": "string",
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorName": "string",
          "updaterName": "string",
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[PageEmbeddingConfigVO](#schemapageembeddingconfigvo)|false|none||none|

<h2 id="tocS_EmbeddingConfig">EmbeddingConfig</h2>

<a id="schemaembeddingconfig"></a>
<a id="schema_EmbeddingConfig"></a>
<a id="tocSembeddingconfig"></a>
<a id="tocsembeddingconfig"></a>

```json
{
  "id": 0,
  "name": "string",
  "modelType": "string",
  "apiKey": "string",
  "baseUrl": "string",
  "dimensions": 0,
  "enabled": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "creatorId": 0,
  "updaterId": 0,
  "remark": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|modelType|string|false|none||none|
|apiKey|string|false|none||none|
|baseUrl|string|false|none||none|
|dimensions|integer(int32)|false|none||none|
|enabled|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|
|creatorId|integer(int64)|false|none||none|
|updaterId|integer(int64)|false|none||none|
|remark|string|false|none||none|

<h2 id="tocS_PageEmbeddingConfig">PageEmbeddingConfig</h2>

<a id="schemapageembeddingconfig"></a>
<a id="schema_PageEmbeddingConfig"></a>
<a id="tocSpageembeddingconfig"></a>
<a id="tocspageembeddingconfig"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "modelType": "string",
      "apiKey": "string",
      "baseUrl": "string",
      "dimensions": 0,
      "enabled": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "creatorId": 0,
      "updaterId": 0,
      "remark": "string"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "orders": [
    {
      "column": "string",
      "asc": true
    }
  ],
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorId": 0,
        "updaterId": 0,
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorId": 0,
          "updaterId": 0,
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorId": 0,
          "updaterId": 0,
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "modelType": "string",
        "apiKey": "string",
        "baseUrl": "string",
        "dimensions": 0,
        "enabled": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "creatorId": 0,
        "updaterId": 0,
        "remark": "string"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "string",
        "asc": true
      }
    ],
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorId": 0,
          "updaterId": 0,
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "searchCount": {
      "records": [
        {
          "id": 0,
          "name": "string",
          "modelType": "string",
          "apiKey": "string",
          "baseUrl": "string",
          "dimensions": 0,
          "enabled": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "creatorId": 0,
          "updaterId": 0,
          "remark": "string"
        }
      ],
      "total": 0,
      "size": 0,
      "current": 0,
      "orders": [
        {
          "column": "string",
          "asc": true
        }
      ],
      "optimizeCountSql": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "searchCount": {
        "records": [
          {}
        ],
        "total": 0,
        "size": 0,
        "current": 0,
        "orders": [
          {}
        ],
        "optimizeCountSql": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "searchCount": {
          "records": null,
          "total": null,
          "size": null,
          "current": null,
          "orders": null,
          "optimizeCountSql": null,
          "searchCount": null,
          "optimizeJoinOfCountSql": null,
          "maxLimit": null,
          "countId": null,
          "pages": null
        },
        "optimizeJoinOfCountSql": true,
        "maxLimit": 0,
        "countId": "string",
        "pages": 0
      },
      "optimizeJoinOfCountSql": true,
      "maxLimit": 0,
      "countId": "string",
      "pages": 0
    },
    "optimizeJoinOfCountSql": true,
    "maxLimit": 0,
    "countId": "string",
    "pages": 0
  },
  "optimizeJoinOfCountSql": true,
  "maxLimit": 0,
  "countId": "string",
  "pages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|records|[[EmbeddingConfig](#schemaembeddingconfig)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageEmbeddingConfig](#schemapageembeddingconfig)|false|none||none|
|searchCount|[PageEmbeddingConfig](#schemapageembeddingconfig)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

