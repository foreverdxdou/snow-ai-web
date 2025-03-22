---

AI知识库
---

Base URLs:

* <a href="http://localhost:8080">开发环境: http://localhost:8080</a>

# Authentication

- HTTP Authentication, scheme: bearer

# PC/标签管理

<a id="opIdgetById"></a>

## GET 获取标签详情

GET /kb/tag/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |标签ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbTagVO](#schemarkbtagvo)|

<a id="opIdupdate"></a>

## PUT 更新标签

PUT /kb/tag/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |标签ID|
|name|query|string| 是 |标签名称|
|description|query|string| 否 |标签描述|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbTagVO](#schemarkbtagvo)|

<a id="opIddelete"></a>

## DELETE 删除标签

DELETE /kb/tag/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |标签ID|

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

<a id="opIdupdateStatus"></a>

## PUT 更新标签状态

PUT /kb/tag/{id}/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |标签ID|
|status|query|integer(int32)| 是 |状态|

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

<a id="opIdcreate"></a>

## POST 创建标签

POST /kb/tag

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 是 |标签名称|
|description|query|string| 否 |标签描述|
|kbId|query|integer(int64)| 是 |知识库ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbTagVO](#schemarkbtagvo)|

<a id="opIdpage"></a>

## GET 分页查询标签列表

GET /kb/tag/page

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|current|query|integer(int32)| 否 |页码|
|size|query|integer(int32)| 否 |每页大小|
|name|query|string| 否 |标签名称|
|kbId|query|integer(int64)| 否 |知识库ID|
|creatorId|query|integer(int64)| 否 |创建者ID|
|status|query|integer(int32)| 否 |状态|

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
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RPageKbTagVO](#schemarpagekbtagvo)|

<a id="opIdgetTagsByKbId"></a>

## GET 获取知识库标签列表

GET /kb/tag/kb/{kbId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|path|integer(int64)| 是 |知识库ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RListKbTagVO](#schemarlistkbtagvo)|

# PC/文档管理

<a id="opIdgetById_1"></a>

## GET 获取文档详情

GET /kb/document/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "content": "string",
    "summary": "string",
    "keywords": "string",
    "fileType": "string",
    "fileSize": 0,
    "fileUrl": "string",
    "categoryId": 0,
    "categoryName": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "version": 0,
    "status": 0,
    "tags": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbDocumentVO](#schemarkbdocumentvo)|

<a id="opIdupdate_1"></a>

## PUT 更新文档

PUT /kb/document/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|
|title|query|string| 是 |标题|
|content|query|string| 是 |内容|
|categoryId|query|integer(int64)| 否 |分类ID|
|tagIds|query|array[integer]| 否 |标签ID列表|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "content": "string",
    "summary": "string",
    "keywords": "string",
    "fileType": "string",
    "fileSize": 0,
    "fileUrl": "string",
    "categoryId": 0,
    "categoryName": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "version": 0,
    "status": 0,
    "tags": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbDocumentVO](#schemarkbdocumentvo)|

<a id="opIddelete_1"></a>

## DELETE 删除文档

DELETE /kb/document/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|

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

<a id="opIdgetDocumentTags"></a>

## GET 获取文档标签

GET /kb/document/{id}/tags

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RListKbTagVO](#schemarlistkbtagvo)|

<a id="opIdupdateDocumentTags"></a>

## PUT 更新文档标签

PUT /kb/document/{id}/tags

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|
|tagIds|query|array[integer]| 是 |标签ID列表|

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

<a id="opIdupdateStatus_1"></a>

## PUT 更新文档状态

PUT /kb/document/{id}/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|
|status|query|integer(int32)| 是 |状态|

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

<a id="opIdrollback"></a>

## PUT 回滚版本

PUT /kb/document/{id}/rollback/{versionId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|
|versionId|path|integer(int64)| 是 |版本ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "content": "string",
    "summary": "string",
    "keywords": "string",
    "fileType": "string",
    "fileSize": 0,
    "fileUrl": "string",
    "categoryId": 0,
    "categoryName": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "version": 0,
    "status": 0,
    "tags": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbDocumentVO](#schemarkbdocumentvo)|

<a id="opIdupload"></a>

## POST 上传文档

POST /kb/document/upload

> Body 请求参数

```json
{
  "file": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|title|query|string| 是 |标题|
|kbId|query|integer(int64)| 是 |知识库ID|
|categoryId|query|integer(int64)| 否 |分类ID|
|tagIds|query|array[integer]| 否 |标签ID列表|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |文件|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "content": "string",
    "summary": "string",
    "keywords": "string",
    "fileType": "string",
    "fileSize": 0,
    "fileUrl": "string",
    "categoryId": 0,
    "categoryName": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "version": 0,
    "status": 0,
    "tags": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RKbDocumentVO](#schemarkbdocumentvo)|

<a id="opIdgetVersionHistory"></a>

## GET 获取版本历史

GET /kb/document/{id}/versions

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |文档ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "documentId": 0,
      "version": 0,
      "title": "string",
      "content": "string",
      "fileUrl": "string",
      "creatorId": 0,
      "creatorName": "string",
      "createTime": "2019-08-24T14:15:22Z"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RListKbDocumentVersionVO](#schemarlistkbdocumentversionvo)|

<a id="opIdpage_1"></a>

## GET 分页查询文档列表

GET /kb/document/page

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|current|query|integer(int32)| 否 |页码|
|size|query|integer(int32)| 否 |每页大小|
|title|query|string| 否 |标题|
|kbId|query|integer(int64)| 否 |知识库ID|
|categoryId|query|integer(int64)| 否 |分类ID|
|creatorId|query|integer(int64)| 否 |创建者ID|
|status|query|integer(int32)| 否 |状态|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "size": 0,
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "status": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "current": 0,
    "pages": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[RIPageKbDocumentVO](#schemaripagekbdocumentvo)|

# PC/大模型配置

<a id="opIdupdate_2"></a>

## PUT 更新大模型配置

PUT /api/v1/llm/config

> Body 请求参数

```json
{
  "id": 0,
  "modelName": "string",
  "apiUrl": "string",
  "apiKey": "string",
  "enabled": true,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[LlmConfig](#schemallmconfig)| 否 |none|

> 返回示例

> 200 Response

```json
true
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|boolean|

<a id="opIdsave"></a>

## POST 新增大模型配置

POST /api/v1/llm/config

> Body 请求参数

```json
{
  "id": 0,
  "modelName": "string",
  "apiUrl": "string",
  "apiKey": "string",
  "enabled": true,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[LlmConfig](#schemallmconfig)| 否 |none|

> 返回示例

> 200 Response

```json
true
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|boolean|

<a id="opIdgetById_2"></a>

## GET 获取指定大模型配置

GET /api/v1/llm/config/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |配置ID|

> 返回示例

> 200 Response

```json
{
  "id": 0,
  "modelName": "string",
  "apiUrl": "string",
  "apiKey": "string",
  "enabled": true,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[LlmConfig](#schemallmconfig)|

<a id="opIddelete_2"></a>

## DELETE 删除大模型配置

DELETE /api/v1/llm/config/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |配置ID|

> 返回示例

> 200 Response

```json
true
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|boolean|

<a id="opIdlist"></a>

## GET 获取所有大模型配置

GET /api/v1/llm/config/list

> 返回示例

> 200 Response

```json
[
  {
    "id": 0,
    "modelName": "string",
    "apiUrl": "string",
    "apiKey": "string",
    "enabled": true,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|[[LlmConfig](#schemallmconfig)]|false|none||none|
|» id|integer(int64)|false|none||none|
|» modelName|string|false|none||none|
|» apiUrl|string|false|none||none|
|» apiKey|string|false|none||none|
|» enabled|boolean|false|none||none|
|» createTime|string(date-time)|false|none||none|
|» updateTime|string(date-time)|false|none||none|

# PC/知识库管理

<a id="opIdgetById_3"></a>

## GET 获取知识库详情

GET /api/kb/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |知识库ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "creatorId": 0,
    "creatorName": "string",
    "deptId": 0,
    "deptName": "string",
    "status": 0,
    "documentCount": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "categoryCount": 0,
    "tagCount": 0,
    "userPermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "rolePermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbKnowledgeBaseVO](#schemaresultkbknowledgebasevo)|

<a id="opIdupdate_3"></a>

## PUT 更新知识库

PUT /api/kb/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |知识库ID|
|name|query|string| 是 |知识库名称|
|description|query|string| 否 |知识库描述|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "creatorId": 0,
    "creatorName": "string",
    "deptId": 0,
    "deptName": "string",
    "status": 0,
    "documentCount": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "categoryCount": 0,
    "tagCount": 0,
    "userPermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "rolePermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbKnowledgeBaseVO](#schemaresultkbknowledgebasevo)|

<a id="opIddelete_3"></a>

## DELETE 删除知识库

DELETE /api/kb/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |知识库ID|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdupdateStatus_2"></a>

## PUT 更新知识库状态

PUT /api/kb/{id}/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |知识库ID|
|status|query|integer(int32)| 是 |状态|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdcreate_1"></a>

## POST 创建知识库

POST /api/kb

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 是 |知识库名称|
|description|query|string| 否 |知识库描述|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "creatorId": 0,
    "creatorName": "string",
    "deptId": 0,
    "deptName": "string",
    "status": 0,
    "documentCount": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "categoryCount": 0,
    "tagCount": 0,
    "userPermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "rolePermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbKnowledgeBaseVO](#schemaresultkbknowledgebasevo)|

<a id="opIdassignPermissions"></a>

## POST 分配知识库权限

POST /api/kb/{kbId}/permissions

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|path|integer(int64)| 是 |知识库ID|
|userIds|query|array[integer]| 否 |用户ID列表|
|roleIds|query|array[integer]| 否 |角色ID列表|
|permissionType|query|integer(int32)| 是 |权限类型|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdgetUserKnowledgeBases"></a>

## GET 获取用户可访问的知识库列表

GET /api/kb/user/list

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "creatorId": 0,
      "creatorName": "string",
      "deptId": 0,
      "deptName": "string",
      "status": 0,
      "documentCount": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "categoryCount": 0,
      "tagCount": 0,
      "userPermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "rolePermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ]
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultListKbKnowledgeBaseVO](#schemaresultlistkbknowledgebasevo)|

<a id="opIdlist_1"></a>

## GET 分页查询知识库列表

GET /api/kb/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|records|query|array[object]| 否 |none|
|total|query|integer(int64)| 否 |none|
|size|query|integer(int64)| 否 |none|
|current|query|integer(int64)| 否 |none|
|orders|query|array[object]| 否 |none|
|optimizeCountSql|query|[PageKbKnowledgeBase](#schemapagekbknowledgebase)| 否 |none|
|searchCount|query|[PageKbKnowledgeBase](#schemapagekbknowledgebase)| 否 |none|
|optimizeJoinOfCountSql|query|boolean| 否 |none|
|maxLimit|query|integer(int64)| 否 |none|
|countId|query|string| 否 |none|
|pages|query|integer(int64)| 否 |none|
|name|query|string| 否 |知识库名称|
|status|query|integer(int32)| 否 |状态|

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
        "description": "string",
        "creatorId": 0,
        "creatorName": "string",
        "deptId": 0,
        "deptName": "string",
        "status": 0,
        "documentCount": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "categoryCount": 0,
        "tagCount": 0,
        "userPermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "rolePermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultPageKbKnowledgeBaseVO](#schemaresultpagekbknowledgebasevo)|

# PC/知识库分类管理

<a id="opIdgetById_4"></a>

## GET 获取分类详情

GET /api/kb/category/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |分类ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "parentId": 0,
    "kbId": 0,
    "sort": 0,
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "children": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
      }
    ],
    "documentCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbCategoryVO](#schemaresultkbcategoryvo)|

<a id="opIdupdate_4"></a>

## PUT 更新分类

PUT /api/kb/category/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |分类ID|
|name|query|string| 是 |分类名称|
|description|query|string| 否 |分类描述|
|parentId|query|integer(int64)| 否 |父分类ID|
|sort|query|integer(int32)| 否 |排序号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "parentId": 0,
    "kbId": 0,
    "sort": 0,
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "children": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
      }
    ],
    "documentCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbCategoryVO](#schemaresultkbcategoryvo)|

<a id="opIddelete_4"></a>

## DELETE 删除分类

DELETE /api/kb/category/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |分类ID|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdupdateStatus_3"></a>

## PUT 更新分类状态

PUT /api/kb/category/{id}/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |分类ID|
|status|query|integer(int32)| 是 |状态|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdmoveCategory"></a>

## PUT 移动分类

PUT /api/kb/category/{id}/move

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|integer(int64)| 是 |分类ID|
|parentId|query|integer(int64)| 否 |目标父分类ID|
|sort|query|integer(int32)| 否 |目标排序号|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdcreate_2"></a>

## POST 创建分类

POST /api/kb/category

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|query|integer(int64)| 是 |知识库ID|
|name|query|string| 是 |分类名称|
|description|query|string| 否 |分类描述|
|parentId|query|integer(int64)| 否 |父分类ID|
|sort|query|integer(int32)| 否 |排序号|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "parentId": 0,
    "kbId": 0,
    "sort": 0,
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "children": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
      }
    ],
    "documentCount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultKbCategoryVO](#schemaresultkbcategoryvo)|

<a id="opIdgetCategoryTree"></a>

## GET 获取知识库的分类树

GET /api/kb/category/tree/{kbId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|path|integer(int64)| 是 |知识库ID|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "parentId": 0,
      "kbId": 0,
      "sort": 0,
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "children": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            {}
          ],
          "documentCount": 0
        }
      ],
      "documentCount": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultListKbCategoryVO](#schemaresultlistkbcategoryvo)|

<a id="opIdlist_2"></a>

## GET 分页查询分类列表

GET /api/kb/category/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|records|query|array[object]| 否 |none|
|total|query|integer(int64)| 否 |none|
|size|query|integer(int64)| 否 |none|
|current|query|integer(int64)| 否 |none|
|orders|query|array[object]| 否 |none|
|optimizeCountSql|query|[PageKbCategory](#schemapagekbcategory)| 否 |none|
|searchCount|query|[PageKbCategory](#schemapagekbcategory)| 否 |none|
|optimizeJoinOfCountSql|query|boolean| 否 |none|
|maxLimit|query|integer(int64)| 否 |none|
|countId|query|string| 否 |none|
|pages|query|integer(int64)| 否 |none|
|kbId|query|integer(int64)| 是 |知识库ID|
|name|query|string| 否 |分类名称|
|status|query|integer(int32)| 否 |状态|

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
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultPageKbCategoryVO](#schemaresultpagekbcategoryvo)|

# PC/知识库个性化推荐

<a id="opIdrecordUserBehavior"></a>

## POST 记录用户行为

POST /api/v1/kb/recommend/behavior

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|query|integer(int64)| 是 |用户ID|
|docId|query|integer(int64)| 是 |文档ID|
|behaviorType|query|string| 是 |行为类型|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

<a id="opIdgetRelatedRecommendations"></a>

## GET 获取相关推荐

GET /api/v1/kb/recommend/related

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|docId|query|integer(int64)| 是 |文档ID|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

<a id="opIdgetPersonalRecommendations"></a>

## GET 获取个性化推荐

GET /api/v1/kb/recommend/personal

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|userId|query|integer(int64)| 是 |用户ID|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

<a id="opIdgetHotRecommendations"></a>

## GET 获取热门推荐

GET /api/v1/kb/recommend/hot

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

# PC/知识库问答系统

<a id="opIdgeneralChat"></a>

## POST 通用问答

POST /api/v1/kb/qa/general

> Body 请求参数

```json
{
  "question": "string",
  "sessionId": "string",
  "context": [
    "string"
  ],
  "temperature": 0.1,
  "maxTokens": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[QaRequest](#schemaqarequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "answer": "string",
  "sessionId": "string",
  "tokensUsed": 0,
  "processTime": 0,
  "success": true,
  "errorMessage": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[QaResponse](#schemaqaresponse)|

<a id="opIdstreamGeneralChat"></a>

## POST 通用流式问答

POST /api/v1/kb/qa/general/stream

> Body 请求参数

```json
{
  "question": "string",
  "sessionId": "string",
  "context": [
    "string"
  ],
  "temperature": 0.1,
  "maxTokens": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[QaRequest](#schemaqarequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "timeout": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[SseEmitter](#schemasseemitter)|

<a id="opIdchat"></a>

## POST 知识库问答

POST /api/v1/kb/qa/chat

> Body 请求参数

```json
{
  "question": "string",
  "sessionId": "string",
  "context": [
    "string"
  ],
  "temperature": 0.1,
  "maxTokens": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|query|integer(int64)| 否 |知识库ID|
|body|body|[QaRequest](#schemaqarequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "answer": "string",
  "sessionId": "string",
  "tokensUsed": 0,
  "processTime": 0,
  "success": true,
  "errorMessage": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[QaResponse](#schemaqaresponse)|

<a id="opIdstreamChat"></a>

## POST 知识库流式问答

POST /api/v1/kb/qa/chat/stream

> Body 请求参数

```json
{
  "question": "string",
  "sessionId": "string",
  "context": [
    "string"
  ],
  "temperature": 0.1,
  "maxTokens": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|kbId|query|integer(int64)| 否 |知识库ID|
|body|body|[QaRequest](#schemaqarequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "timeout": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[SseEmitter](#schemasseemitter)|

<a id="opIdgetChatHistory"></a>

## GET 获取对话历史

GET /api/v1/kb/qa/history

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|query|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "sessionId": "string",
      "kbId": 0,
      "userId": 0,
      "question": "string",
      "answer": "string",
      "tokensUsed": 0,
      "processTime": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "sessionId": "string",
        "kbId": 0,
        "userId": 0,
        "question": "string",
        "answer": "string",
        "tokensUsed": 0,
        "processTime": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "sessionId": "string",
        "kbId": 0,
        "userId": 0,
        "question": "string",
        "answer": "string",
        "tokensUsed": 0,
        "processTime": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbChatHistory](#schemapagekbchathistory)|

<a id="opIdclearChatHistory"></a>

## DELETE 清除对话历史

DELETE /api/v1/kb/qa/history/{sessionId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sessionId|path|string| 是 |会话ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# PC/知识库文档处理

<a id="opIdgenerateSummary"></a>

## POST 生成文档摘要

POST /api/v1/kb/document/process/summary

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|content|query|string| 是 |文档内容|
|maxLength|query|integer(int32)| 否 |摘要最大长度|

> 返回示例

> 200 Response

```json
"string"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|

<a id="opIdprocessDocument"></a>

## POST 处理文档内容

POST /api/v1/kb/document/process/process

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|content|query|string| 是 |文档内容|
|maxSummaryLength|query|integer(int32)| 否 |摘要最大长度|
|maxKeywords|query|integer(int32)| 否 |关键词最大数量|

> 返回示例

> 200 Response

```json
{
  "summary": "string",
  "keywords": "string",
  "success": true,
  "errorMessage": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[DocumentProcessResult](#schemadocumentprocessresult)|

<a id="opIdextractKeywords"></a>

## POST 提取文档关键词

POST /api/v1/kb/document/process/keywords

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|content|query|string| 是 |文档内容|
|maxKeywords|query|integer(int32)| 否 |关键词最大数量|

> 返回示例

> 200 Response

```json
"string"
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|

# PC/认证管理

<a id="opIdregister"></a>

## POST 用户注册

POST /api/auth/register

> Body 请求参数

```json
{
  "username": "string",
  "password": "string",
  "nickname": "string",
  "email": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[RegisterRequest](#schemaregisterrequest)| 否 |none|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdlogout"></a>

## POST 退出登录

POST /api/auth/logout

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultVoid](#schemaresultvoid)|

<a id="opIdlogin"></a>

## POST 用户登录

POST /api/auth/login

> Body 请求参数

```json
{
  "username": "admin",
  "password": "123456"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "token": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultLoginResponse](#schemaresultloginresponse)|

<a id="opIdgetCurrentUser"></a>

## GET 获取当前用户信息

GET /api/auth/current-user

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "password": "string",
    "nickname": "string",
    "email": "string",
    "avatar": "string",
    "deptId": 0,
    "status": 0,
    "deleted": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[ResultSysUser](#schemaresultsysuser)|

# PC/知识库智能搜索

<a id="opIdgetDocumentSimilarity"></a>

## GET 获取文档相似度

GET /api/v1/kb/search/similarity

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|docId1|query|integer(int64)| 是 |文档1 ID|
|docId2|query|integer(int64)| 是 |文档2 ID|

> 返回示例

> 200 Response

```json
0.1
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|number|

<a id="opIdsemanticSearch"></a>

## GET 语义搜索

GET /api/v1/kb/search/semantic

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|query|query|string| 是 |搜索关键词|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|
|tagIds|query|array[integer]| 否 |标签ID列表|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

<a id="opIdkeywordSearch"></a>

## GET 关键词搜索

GET /api/v1/kb/search/keyword

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|query|query|string| 是 |搜索关键词|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|
|tagIds|query|array[integer]| 否 |标签ID列表|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

<a id="opIdhybridSearch"></a>

## GET 混合搜索

GET /api/v1/kb/search/hybrid

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|query|query|string| 是 |搜索关键词|
|kbId|query|integer(int64)| 是 |知识库ID|
|current|query|integer(int64)| 否 |页码|
|size|query|integer(int64)| 否 |每页大小|
|tagIds|query|array[integer]| 否 |标签ID列表|

> 返回示例

> 200 Response

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "size": 0,
  "current": 0,
  "optimizeCountSql": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "searchCount": {
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "optimizeCountSql": {
      "records": [
        {
          "id": 0,
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
  },
  "pages": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[PageKbSearchVO](#schemapagekbsearchvo)|

# 数据模型

<h2 id="tocS_KbTagVO">KbTagVO</h2>

<a id="schemakbtagvo"></a>
<a id="schema_KbTagVO"></a>
<a id="tocSkbtagvo"></a>
<a id="tocskbtagvo"></a>

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "kbId": 0,
  "kbName": "string",
  "creatorId": 0,
  "creatorName": "string",
  "status": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

标签VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||标签ID|
|name|string|false|none||标签名称|
|description|string|false|none||标签描述|
|kbId|integer(int64)|false|none||知识库ID|
|kbName|string|false|none||知识库名称|
|creatorId|integer(int64)|false|none||创建者ID|
|creatorName|string|false|none||创建者名称|
|status|integer(int32)|false|none||状态|
|createTime|string(date-time)|false|none||创建时间|
|updateTime|string(date-time)|false|none||更新时间|

<h2 id="tocS_RKbTagVO">RKbTagVO</h2>

<a id="schemarkbtagvo"></a>
<a id="schema_RKbTagVO"></a>
<a id="tocSrkbtagvo"></a>
<a id="tocsrkbtagvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[KbTagVO](#schemakbtagvo)|false|none||标签VO|

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

<h2 id="tocS_KbDocumentVO">KbDocumentVO</h2>

<a id="schemakbdocumentvo"></a>
<a id="schema_KbDocumentVO"></a>
<a id="tocSkbdocumentvo"></a>
<a id="tocskbdocumentvo"></a>

```json
{
  "id": 0,
  "title": "string",
  "content": "string",
  "summary": "string",
  "keywords": "string",
  "fileType": "string",
  "fileSize": 0,
  "fileUrl": "string",
  "categoryId": 0,
  "categoryName": "string",
  "kbId": 0,
  "kbName": "string",
  "creatorId": 0,
  "creatorName": "string",
  "version": 0,
  "status": 0,
  "tags": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

文档VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||文档ID|
|title|string|false|none||标题|
|content|string|false|none||内容|
|summary|string|false|none||摘要|
|keywords|string|false|none||关键词|
|fileType|string|false|none||文件类型|
|fileSize|integer(int64)|false|none||文件大小|
|fileUrl|string|false|none||文件URL|
|categoryId|integer(int64)|false|none||分类ID|
|categoryName|string|false|none||分类名称|
|kbId|integer(int64)|false|none||知识库ID|
|kbName|string|false|none||知识库名称|
|creatorId|integer(int64)|false|none||创建者ID|
|creatorName|string|false|none||创建者名称|
|version|integer(int32)|false|none||版本号|
|status|integer(int32)|false|none||状态|
|tags|[[KbTagVO](#schemakbtagvo)]|false|none||标签列表|
|createTime|string(date-time)|false|none||创建时间|
|updateTime|string(date-time)|false|none||更新时间|

<h2 id="tocS_RKbDocumentVO">RKbDocumentVO</h2>

<a id="schemarkbdocumentvo"></a>
<a id="schema_RKbDocumentVO"></a>
<a id="tocSrkbdocumentvo"></a>
<a id="tocsrkbdocumentvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "content": "string",
    "summary": "string",
    "keywords": "string",
    "fileType": "string",
    "fileSize": 0,
    "fileUrl": "string",
    "categoryId": 0,
    "categoryName": "string",
    "kbId": 0,
    "kbName": "string",
    "creatorId": 0,
    "creatorName": "string",
    "version": 0,
    "status": 0,
    "tags": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[KbDocumentVO](#schemakbdocumentvo)|false|none||文档VO|

<h2 id="tocS_LlmConfig">LlmConfig</h2>

<a id="schemallmconfig"></a>
<a id="schema_LlmConfig"></a>
<a id="tocSllmconfig"></a>
<a id="tocsllmconfig"></a>

```json
{
  "id": 0,
  "modelName": "string",
  "apiUrl": "string",
  "apiKey": "string",
  "enabled": true,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|modelName|string|false|none||none|
|apiUrl|string|false|none||none|
|apiKey|string|false|none||none|
|enabled|boolean|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_KbKnowledgeBasePermissionVO">KbKnowledgeBasePermissionVO</h2>

<a id="schemakbknowledgebasepermissionvo"></a>
<a id="schema_KbKnowledgeBasePermissionVO"></a>
<a id="tocSkbknowledgebasepermissionvo"></a>
<a id="tocskbknowledgebasepermissionvo"></a>

```json
{
  "id": 0,
  "kbId": 0,
  "userId": 0,
  "userName": "string",
  "roleId": 0,
  "roleName": "string",
  "permissionType": 0,
  "permissionTypeName": "string",
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|kbId|integer(int64)|false|none||none|
|userId|integer(int64)|false|none||none|
|userName|string|false|none||none|
|roleId|integer(int64)|false|none||none|
|roleName|string|false|none||none|
|permissionType|integer(int32)|false|none||none|
|permissionTypeName|string|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_KbKnowledgeBaseVO">KbKnowledgeBaseVO</h2>

<a id="schemakbknowledgebasevo"></a>
<a id="schema_KbKnowledgeBaseVO"></a>
<a id="tocSkbknowledgebasevo"></a>
<a id="tocskbknowledgebasevo"></a>

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "creatorId": 0,
  "creatorName": "string",
  "deptId": 0,
  "deptName": "string",
  "status": 0,
  "documentCount": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "categoryCount": 0,
  "tagCount": 0,
  "userPermissions": [
    {
      "id": 0,
      "kbId": 0,
      "userId": 0,
      "userName": "string",
      "roleId": 0,
      "roleName": "string",
      "permissionType": 0,
      "permissionTypeName": "string",
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "rolePermissions": [
    {
      "id": 0,
      "kbId": 0,
      "userId": 0,
      "userName": "string",
      "roleId": 0,
      "roleName": "string",
      "permissionType": 0,
      "permissionTypeName": "string",
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|description|string|false|none||none|
|creatorId|integer(int64)|false|none||none|
|creatorName|string|false|none||none|
|deptId|integer(int64)|false|none||none|
|deptName|string|false|none||none|
|status|integer(int32)|false|none||none|
|documentCount|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|
|categoryCount|integer(int32)|false|none||none|
|tagCount|integer(int32)|false|none||none|
|userPermissions|[[KbKnowledgeBasePermissionVO](#schemakbknowledgebasepermissionvo)]|false|none||none|
|rolePermissions|[[KbKnowledgeBasePermissionVO](#schemakbknowledgebasepermissionvo)]|false|none||none|

<h2 id="tocS_ResultKbKnowledgeBaseVO">ResultKbKnowledgeBaseVO</h2>

<a id="schemaresultkbknowledgebasevo"></a>
<a id="schema_ResultKbKnowledgeBaseVO"></a>
<a id="tocSresultkbknowledgebasevo"></a>
<a id="tocsresultkbknowledgebasevo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "creatorId": 0,
    "creatorName": "string",
    "deptId": 0,
    "deptName": "string",
    "status": 0,
    "documentCount": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "categoryCount": 0,
    "tagCount": 0,
    "userPermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "rolePermissions": [
      {
        "id": 0,
        "kbId": 0,
        "userId": 0,
        "userName": "string",
        "roleId": 0,
        "roleName": "string",
        "permissionType": 0,
        "permissionTypeName": "string",
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[KbKnowledgeBaseVO](#schemakbknowledgebasevo)|false|none||none|

<h2 id="tocS_ResultVoid">ResultVoid</h2>

<a id="schemaresultvoid"></a>
<a id="schema_ResultVoid"></a>
<a id="tocSresultvoid"></a>
<a id="tocsresultvoid"></a>

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

<h2 id="tocS_KbCategoryVO">KbCategoryVO</h2>

<a id="schemakbcategoryvo"></a>
<a id="schema_KbCategoryVO"></a>
<a id="tocSkbcategoryvo"></a>
<a id="tocskbcategoryvo"></a>

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "parentId": 0,
  "kbId": 0,
  "sort": 0,
  "creatorId": 0,
  "creatorName": "string",
  "status": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "children": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "parentId": 0,
      "kbId": 0,
      "sort": 0,
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "children": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            {}
          ],
          "documentCount": 0
        }
      ],
      "documentCount": 0
    }
  ],
  "documentCount": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|description|string|false|none||none|
|parentId|integer(int64)|false|none||none|
|kbId|integer(int64)|false|none||none|
|sort|integer(int32)|false|none||none|
|creatorId|integer(int64)|false|none||none|
|creatorName|string|false|none||none|
|status|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|
|children|[[KbCategoryVO](#schemakbcategoryvo)]|false|none||none|
|documentCount|integer(int32)|false|none||none|

<h2 id="tocS_ResultKbCategoryVO">ResultKbCategoryVO</h2>

<a id="schemaresultkbcategoryvo"></a>
<a id="schema_ResultKbCategoryVO"></a>
<a id="tocSresultkbcategoryvo"></a>
<a id="tocsresultkbcategoryvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "parentId": 0,
    "kbId": 0,
    "sort": 0,
    "creatorId": 0,
    "creatorName": "string",
    "status": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z",
    "children": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
      }
    ],
    "documentCount": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[KbCategoryVO](#schemakbcategoryvo)|false|none||none|

<h2 id="tocS_QaRequest">QaRequest</h2>

<a id="schemaqarequest"></a>
<a id="schema_QaRequest"></a>
<a id="tocSqarequest"></a>
<a id="tocsqarequest"></a>

```json
{
  "question": "string",
  "sessionId": "string",
  "context": [
    "string"
  ],
  "temperature": 0.1,
  "maxTokens": 0
}

```

问答请求模型

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|question|string|false|none||问题内容|
|sessionId|string|false|none||会话ID|
|context|[string]|false|none||上下文消息列表|
|temperature|number(double)|false|none||温度参数|
|maxTokens|integer(int32)|false|none||最大token数|

<h2 id="tocS_QaResponse">QaResponse</h2>

<a id="schemaqaresponse"></a>
<a id="schema_QaResponse"></a>
<a id="tocSqaresponse"></a>
<a id="tocsqaresponse"></a>

```json
{
  "answer": "string",
  "sessionId": "string",
  "tokensUsed": 0,
  "processTime": 0,
  "success": true,
  "errorMessage": "string"
}

```

问答响应模型

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|answer|string|false|none||回答内容|
|sessionId|string|false|none||会话ID|
|tokensUsed|integer(int32)|false|none||使用的token数|
|processTime|integer(int64)|false|none||处理时间(毫秒)|
|success|boolean|false|none||是否成功|
|errorMessage|string|false|none||错误信息|

<h2 id="tocS_SseEmitter">SseEmitter</h2>

<a id="schemasseemitter"></a>
<a id="schema_SseEmitter"></a>
<a id="tocSsseemitter"></a>
<a id="tocssseemitter"></a>

```json
{
  "timeout": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|timeout|integer(int64)|false|none||none|

<h2 id="tocS_DocumentProcessResult">DocumentProcessResult</h2>

<a id="schemadocumentprocessresult"></a>
<a id="schema_DocumentProcessResult"></a>
<a id="tocSdocumentprocessresult"></a>
<a id="tocsdocumentprocessresult"></a>

```json
{
  "summary": "string",
  "keywords": "string",
  "success": true,
  "errorMessage": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|summary|string|false|none||none|
|keywords|string|false|none||none|
|success|boolean|false|none||none|
|errorMessage|string|false|none||none|

<h2 id="tocS_RegisterRequest">RegisterRequest</h2>

<a id="schemaregisterrequest"></a>
<a id="schema_RegisterRequest"></a>
<a id="tocSregisterrequest"></a>
<a id="tocsregisterrequest"></a>

```json
{
  "username": "string",
  "password": "string",
  "nickname": "string",
  "email": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|false|none||none|
|password|string|false|none||none|
|nickname|string|false|none||none|
|email|string|false|none||none|

<h2 id="tocS_LoginRequest">LoginRequest</h2>

<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "username": "string",
  "password": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|username|string|false|none||none|
|password|string|false|none||none|

<h2 id="tocS_LoginResponse">LoginResponse</h2>

<a id="schemaloginresponse"></a>
<a id="schema_LoginResponse"></a>
<a id="tocSloginresponse"></a>
<a id="tocsloginresponse"></a>

```json
{
  "token": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|token|string|false|none||none|

<h2 id="tocS_ResultLoginResponse">ResultLoginResponse</h2>

<a id="schemaresultloginresponse"></a>
<a id="schema_ResultLoginResponse"></a>
<a id="tocSresultloginresponse"></a>
<a id="tocsresultloginresponse"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "token": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[LoginResponse](#schemaloginresponse)|false|none||none|

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

<h2 id="tocS_PageKbTagVO">PageKbTagVO</h2>

<a id="schemapagekbtagvo"></a>
<a id="schema_PageKbTagVO"></a>
<a id="tocSpagekbtagvo"></a>
<a id="tocspagekbtagvo"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
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
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
|records|[[KbTagVO](#schemakbtagvo)]|false|none||[标签VO]|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbTagVO](#schemapagekbtagvo)|false|none||none|
|searchCount|[PageKbTagVO](#schemapagekbtagvo)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_RPageKbTagVO">RPageKbTagVO</h2>

<a id="schemarpagekbtagvo"></a>
<a id="schema_RPageKbTagVO"></a>
<a id="tocSrpagekbtagvo"></a>
<a id="tocsrpagekbtagvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
|data|[PageKbTagVO](#schemapagekbtagvo)|false|none||none|

<h2 id="tocS_RListKbTagVO">RListKbTagVO</h2>

<a id="schemarlistkbtagvo"></a>
<a id="schema_RListKbTagVO"></a>
<a id="tocSrlistkbtagvo"></a>
<a id="tocsrlistkbtagvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[[KbTagVO](#schemakbtagvo)]|false|none||[标签VO]|

<h2 id="tocS_KbDocumentVersionVO">KbDocumentVersionVO</h2>

<a id="schemakbdocumentversionvo"></a>
<a id="schema_KbDocumentVersionVO"></a>
<a id="tocSkbdocumentversionvo"></a>
<a id="tocskbdocumentversionvo"></a>

```json
{
  "id": 0,
  "documentId": 0,
  "version": 0,
  "title": "string",
  "content": "string",
  "fileUrl": "string",
  "creatorId": 0,
  "creatorName": "string",
  "createTime": "2019-08-24T14:15:22Z"
}

```

文档版本VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||版本ID|
|documentId|integer(int64)|false|none||文档ID|
|version|integer(int32)|false|none||版本号|
|title|string|false|none||标题|
|content|string|false|none||内容|
|fileUrl|string|false|none||文件URL|
|creatorId|integer(int64)|false|none||创建者ID|
|creatorName|string|false|none||创建者名称|
|createTime|string(date-time)|false|none||创建时间|

<h2 id="tocS_RListKbDocumentVersionVO">RListKbDocumentVersionVO</h2>

<a id="schemarlistkbdocumentversionvo"></a>
<a id="schema_RListKbDocumentVersionVO"></a>
<a id="tocSrlistkbdocumentversionvo"></a>
<a id="tocsrlistkbdocumentversionvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "documentId": 0,
      "version": 0,
      "title": "string",
      "content": "string",
      "fileUrl": "string",
      "creatorId": 0,
      "creatorName": "string",
      "createTime": "2019-08-24T14:15:22Z"
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[[KbDocumentVersionVO](#schemakbdocumentversionvo)]|false|none||[文档版本VO]|

<h2 id="tocS_IPageKbDocumentVO">IPageKbDocumentVO</h2>

<a id="schemaipagekbdocumentvo"></a>
<a id="schema_IPageKbDocumentVO"></a>
<a id="tocSipagekbdocumentvo"></a>
<a id="tocsipagekbdocumentvo"></a>

```json
{
  "size": 0,
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "status": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "current": 0,
  "pages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|size|integer(int64)|false|none||none|
|records|[[KbDocumentVO](#schemakbdocumentvo)]|false|none||[文档VO]|
|total|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_RIPageKbDocumentVO">RIPageKbDocumentVO</h2>

<a id="schemaripagekbdocumentvo"></a>
<a id="schema_RIPageKbDocumentVO"></a>
<a id="tocSripagekbdocumentvo"></a>
<a id="tocsripagekbdocumentvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "size": 0,
    "records": [
      {
        "id": 0,
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "status": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
      }
    ],
    "total": 0,
    "current": 0,
    "pages": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[IPageKbDocumentVO](#schemaipagekbdocumentvo)|false|none||none|

<h2 id="tocS_KbSearchVO">KbSearchVO</h2>

<a id="schemakbsearchvo"></a>
<a id="schema_KbSearchVO"></a>
<a id="tocSkbsearchvo"></a>
<a id="tocskbsearchvo"></a>

```json
{
  "id": 0,
  "title": "string",
  "content": "string",
  "summary": "string",
  "keywords": "string",
  "fileType": "string",
  "fileSize": 0,
  "fileUrl": "string",
  "categoryId": 0,
  "categoryName": "string",
  "kbId": 0,
  "kbName": "string",
  "creatorId": 0,
  "creatorName": "string",
  "version": 0,
  "tags": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
    }
  ],
  "similarity": 0.1,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|title|string|false|none||none|
|content|string|false|none||none|
|summary|string|false|none||none|
|keywords|string|false|none||none|
|fileType|string|false|none||none|
|fileSize|integer(int64)|false|none||none|
|fileUrl|string|false|none||none|
|categoryId|integer(int64)|false|none||none|
|categoryName|string|false|none||none|
|kbId|integer(int64)|false|none||none|
|kbName|string|false|none||none|
|creatorId|integer(int64)|false|none||none|
|creatorName|string|false|none||none|
|version|integer(int32)|false|none||none|
|tags|[[KbTagVO](#schemakbtagvo)]|false|none||[标签VO]|
|similarity|number(double)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_PageKbSearchVO">PageKbSearchVO</h2>

<a id="schemapagekbsearchvo"></a>
<a id="schema_PageKbSearchVO"></a>
<a id="tocSpagekbsearchvo"></a>
<a id="tocspagekbsearchvo"></a>

```json
{
  "records": [
    {
      "id": 0,
      "title": "string",
      "content": "string",
      "summary": "string",
      "keywords": "string",
      "fileType": "string",
      "fileSize": 0,
      "fileUrl": "string",
      "categoryId": 0,
      "categoryName": "string",
      "kbId": 0,
      "kbName": "string",
      "creatorId": 0,
      "creatorName": "string",
      "version": 0,
      "tags": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "similarity": 0.1,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
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
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
        "title": "string",
        "content": "string",
        "summary": "string",
        "keywords": "string",
        "fileType": "string",
        "fileSize": 0,
        "fileUrl": "string",
        "categoryId": 0,
        "categoryName": "string",
        "kbId": 0,
        "kbName": "string",
        "creatorId": 0,
        "creatorName": "string",
        "version": 0,
        "tags": [
          {
            "id": null,
            "name": null,
            "description": null,
            "kbId": null,
            "kbName": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "similarity": 0.1,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "title": "string",
          "content": "string",
          "summary": "string",
          "keywords": "string",
          "fileType": "string",
          "fileSize": 0,
          "fileUrl": "string",
          "categoryId": 0,
          "categoryName": "string",
          "kbId": 0,
          "kbName": "string",
          "creatorId": 0,
          "creatorName": "string",
          "version": 0,
          "tags": [
            null
          ],
          "similarity": 0.1,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
|records|[[KbSearchVO](#schemakbsearchvo)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbSearchVO](#schemapagekbsearchvo)|false|none||none|
|searchCount|[PageKbSearchVO](#schemapagekbsearchvo)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_KbChatHistory">KbChatHistory</h2>

<a id="schemakbchathistory"></a>
<a id="schema_KbChatHistory"></a>
<a id="tocSkbchathistory"></a>
<a id="tocskbchathistory"></a>

```json
{
  "id": 0,
  "sessionId": "string",
  "kbId": 0,
  "userId": 0,
  "question": "string",
  "answer": "string",
  "tokensUsed": 0,
  "processTime": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|sessionId|string|false|none||none|
|kbId|integer(int64)|false|none||none|
|userId|integer(int64)|false|none||none|
|question|string|false|none||none|
|answer|string|false|none||none|
|tokensUsed|integer(int32)|false|none||none|
|processTime|integer(int64)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|

<h2 id="tocS_PageKbChatHistory">PageKbChatHistory</h2>

<a id="schemapagekbchathistory"></a>
<a id="schema_PageKbChatHistory"></a>
<a id="tocSpagekbchathistory"></a>
<a id="tocspagekbchathistory"></a>

```json
{
  "records": [
    {
      "id": 0,
      "sessionId": "string",
      "kbId": 0,
      "userId": 0,
      "question": "string",
      "answer": "string",
      "tokensUsed": 0,
      "processTime": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z"
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
        "sessionId": "string",
        "kbId": 0,
        "userId": 0,
        "question": "string",
        "answer": "string",
        "tokensUsed": 0,
        "processTime": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
        "sessionId": "string",
        "kbId": 0,
        "userId": 0,
        "question": "string",
        "answer": "string",
        "tokensUsed": 0,
        "processTime": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
          "sessionId": "string",
          "kbId": 0,
          "userId": 0,
          "question": "string",
          "answer": "string",
          "tokensUsed": 0,
          "processTime": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
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
|records|[[KbChatHistory](#schemakbchathistory)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbChatHistory](#schemapagekbchathistory)|false|none||none|
|searchCount|[PageKbChatHistory](#schemapagekbchathistory)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_ResultListKbKnowledgeBaseVO">ResultListKbKnowledgeBaseVO</h2>

<a id="schemaresultlistkbknowledgebasevo"></a>
<a id="schema_ResultListKbKnowledgeBaseVO"></a>
<a id="tocSresultlistkbknowledgebasevo"></a>
<a id="tocsresultlistkbknowledgebasevo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "creatorId": 0,
      "creatorName": "string",
      "deptId": 0,
      "deptName": "string",
      "status": 0,
      "documentCount": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "categoryCount": 0,
      "tagCount": 0,
      "userPermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "rolePermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ]
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[[KbKnowledgeBaseVO](#schemakbknowledgebasevo)]|false|none||none|

<h2 id="tocS_KbKnowledgeBase">KbKnowledgeBase</h2>

<a id="schemakbknowledgebase"></a>
<a id="schema_KbKnowledgeBase"></a>
<a id="tocSkbknowledgebase"></a>
<a id="tocskbknowledgebase"></a>

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "creatorId": 0,
  "deptId": 0,
  "status": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "deleted": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|description|string|false|none||none|
|creatorId|integer(int64)|false|none||none|
|deptId|integer(int64)|false|none||none|
|status|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|
|deleted|integer(int32)|false|none||none|

<h2 id="tocS_PageKbKnowledgeBase">PageKbKnowledgeBase</h2>

<a id="schemapagekbknowledgebase"></a>
<a id="schema_PageKbKnowledgeBase"></a>
<a id="tocSpagekbknowledgebase"></a>
<a id="tocspagekbknowledgebase"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "creatorId": 0,
      "deptId": 0,
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "deleted": 0
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
        "description": "string",
        "creatorId": 0,
        "deptId": 0,
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "deleted": 0
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
          "description": "string",
          "creatorId": 0,
          "deptId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
          "description": "string",
          "creatorId": 0,
          "deptId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
        "description": "string",
        "creatorId": 0,
        "deptId": 0,
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "deleted": 0
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
          "description": "string",
          "creatorId": 0,
          "deptId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
          "description": "string",
          "creatorId": 0,
          "deptId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
|records|[[KbKnowledgeBase](#schemakbknowledgebase)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbKnowledgeBase](#schemapagekbknowledgebase)|false|none||none|
|searchCount|[PageKbKnowledgeBase](#schemapagekbknowledgebase)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_PageKbKnowledgeBaseVO">PageKbKnowledgeBaseVO</h2>

<a id="schemapagekbknowledgebasevo"></a>
<a id="schema_PageKbKnowledgeBaseVO"></a>
<a id="tocSpagekbknowledgebasevo"></a>
<a id="tocspagekbknowledgebasevo"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "creatorId": 0,
      "creatorName": "string",
      "deptId": 0,
      "deptName": "string",
      "status": 0,
      "documentCount": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "categoryCount": 0,
      "tagCount": 0,
      "userPermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ],
      "rolePermissions": [
        {
          "id": 0,
          "kbId": 0,
          "userId": 0,
          "userName": "string",
          "roleId": 0,
          "roleName": "string",
          "permissionType": 0,
          "permissionTypeName": "string",
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z"
        }
      ]
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
        "description": "string",
        "creatorId": 0,
        "creatorName": "string",
        "deptId": 0,
        "deptName": "string",
        "status": 0,
        "documentCount": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "categoryCount": 0,
        "tagCount": 0,
        "userPermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "rolePermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
        "description": "string",
        "creatorId": 0,
        "creatorName": "string",
        "deptId": 0,
        "deptName": "string",
        "status": 0,
        "documentCount": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "categoryCount": 0,
        "tagCount": 0,
        "userPermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "rolePermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
|records|[[KbKnowledgeBaseVO](#schemakbknowledgebasevo)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbKnowledgeBaseVO](#schemapagekbknowledgebasevo)|false|none||none|
|searchCount|[PageKbKnowledgeBaseVO](#schemapagekbknowledgebasevo)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_ResultPageKbKnowledgeBaseVO">ResultPageKbKnowledgeBaseVO</h2>

<a id="schemaresultpagekbknowledgebasevo"></a>
<a id="schema_ResultPageKbKnowledgeBaseVO"></a>
<a id="tocSresultpagekbknowledgebasevo"></a>
<a id="tocsresultpagekbknowledgebasevo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "creatorId": 0,
        "creatorName": "string",
        "deptId": 0,
        "deptName": "string",
        "status": 0,
        "documentCount": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "categoryCount": 0,
        "tagCount": 0,
        "userPermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ],
        "rolePermissions": [
          {
            "id": null,
            "kbId": null,
            "userId": null,
            "userName": null,
            "roleId": null,
            "roleName": null,
            "permissionType": null,
            "permissionTypeName": null,
            "createTime": null,
            "updateTime": null
          }
        ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
          "description": "string",
          "creatorId": 0,
          "creatorName": "string",
          "deptId": 0,
          "deptName": "string",
          "status": 0,
          "documentCount": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "categoryCount": 0,
          "tagCount": 0,
          "userPermissions": [
            null
          ],
          "rolePermissions": [
            null
          ]
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
|data|[PageKbKnowledgeBaseVO](#schemapagekbknowledgebasevo)|false|none||none|

<h2 id="tocS_ResultListKbCategoryVO">ResultListKbCategoryVO</h2>

<a id="schemaresultlistkbcategoryvo"></a>
<a id="schema_ResultListKbCategoryVO"></a>
<a id="tocSresultlistkbcategoryvo"></a>
<a id="tocsresultlistkbcategoryvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "parentId": 0,
      "kbId": 0,
      "sort": 0,
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "children": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            {}
          ],
          "documentCount": 0
        }
      ],
      "documentCount": 0
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[[KbCategoryVO](#schemakbcategoryvo)]|false|none||none|

<h2 id="tocS_KbCategory">KbCategory</h2>

<a id="schemakbcategory"></a>
<a id="schema_KbCategory"></a>
<a id="tocSkbcategory"></a>
<a id="tocskbcategory"></a>

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "parentId": 0,
  "kbId": 0,
  "sort": 0,
  "creatorId": 0,
  "status": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z",
  "deleted": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|name|string|false|none||none|
|description|string|false|none||none|
|parentId|integer(int64)|false|none||none|
|kbId|integer(int64)|false|none||none|
|sort|integer(int32)|false|none||none|
|creatorId|integer(int64)|false|none||none|
|status|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|
|deleted|integer(int32)|false|none||none|

<h2 id="tocS_PageKbCategory">PageKbCategory</h2>

<a id="schemapagekbcategory"></a>
<a id="schema_PageKbCategory"></a>
<a id="tocSpagekbcategory"></a>
<a id="tocspagekbcategory"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "parentId": 0,
      "kbId": 0,
      "sort": 0,
      "creatorId": 0,
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "deleted": 0
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
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "deleted": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "deleted": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "deleted": 0
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
|records|[[KbCategory](#schemakbcategory)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbCategory](#schemapagekbcategory)|false|none||none|
|searchCount|[PageKbCategory](#schemapagekbcategory)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_PageKbCategoryVO">PageKbCategoryVO</h2>

<a id="schemapagekbcategoryvo"></a>
<a id="schema_PageKbCategoryVO"></a>
<a id="tocSpagekbcategoryvo"></a>
<a id="tocspagekbcategoryvo"></a>

```json
{
  "records": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "parentId": 0,
      "kbId": 0,
      "sort": 0,
      "creatorId": 0,
      "creatorName": "string",
      "status": 0,
      "createTime": "2019-08-24T14:15:22Z",
      "updateTime": "2019-08-24T14:15:22Z",
      "children": [
        {
          "id": 0,
          "name": "string",
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            {}
          ],
          "documentCount": 0
        }
      ],
      "documentCount": 0
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
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
|records|[[KbCategoryVO](#schemakbcategoryvo)]|false|none||none|
|total|integer(int64)|false|none||none|
|size|integer(int64)|false|none||none|
|current|integer(int64)|false|none||none|
|orders|[[OrderItem](#schemaorderitem)]|false|write-only||none|
|optimizeCountSql|[PageKbCategoryVO](#schemapagekbcategoryvo)|false|none||none|
|searchCount|[PageKbCategoryVO](#schemapagekbcategoryvo)|false|none||none|
|optimizeJoinOfCountSql|boolean|false|write-only||none|
|maxLimit|integer(int64)|false|write-only||none|
|countId|string|false|write-only||none|
|pages|integer(int64)|false|none||none|

<h2 id="tocS_ResultPageKbCategoryVO">ResultPageKbCategoryVO</h2>

<a id="schemaresultpagekbcategoryvo"></a>
<a id="schema_ResultPageKbCategoryVO"></a>
<a id="tocSresultpagekbcategoryvo"></a>
<a id="tocsresultpagekbcategoryvo"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "records": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "parentId": 0,
        "kbId": 0,
        "sort": 0,
        "creatorId": 0,
        "creatorName": "string",
        "status": 0,
        "createTime": "2019-08-24T14:15:22Z",
        "updateTime": "2019-08-24T14:15:22Z",
        "children": [
          {
            "id": null,
            "name": null,
            "description": null,
            "parentId": null,
            "kbId": null,
            "sort": null,
            "creatorId": null,
            "creatorName": null,
            "status": null,
            "createTime": null,
            "updateTime": null,
            "children": null,
            "documentCount": null
          }
        ],
        "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
          "description": "string",
          "parentId": 0,
          "kbId": 0,
          "sort": 0,
          "creatorId": 0,
          "creatorName": "string",
          "status": 0,
          "createTime": "2019-08-24T14:15:22Z",
          "updateTime": "2019-08-24T14:15:22Z",
          "children": [
            null
          ],
          "documentCount": 0
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
|data|[PageKbCategoryVO](#schemapagekbcategoryvo)|false|none||none|

<h2 id="tocS_ResultSysUser">ResultSysUser</h2>

<a id="schemaresultsysuser"></a>
<a id="schema_ResultSysUser"></a>
<a id="tocSresultsysuser"></a>
<a id="tocsresultsysuser"></a>

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "username": "string",
    "password": "string",
    "nickname": "string",
    "email": "string",
    "avatar": "string",
    "deptId": 0,
    "status": 0,
    "deleted": 0,
    "createTime": "2019-08-24T14:15:22Z",
    "updateTime": "2019-08-24T14:15:22Z"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|message|string|false|none||none|
|data|[SysUser](#schemasysuser)|false|none||none|

<h2 id="tocS_SysUser">SysUser</h2>

<a id="schemasysuser"></a>
<a id="schema_SysUser"></a>
<a id="tocSsysuser"></a>
<a id="tocssysuser"></a>

```json
{
  "id": 0,
  "username": "string",
  "password": "string",
  "nickname": "string",
  "email": "string",
  "avatar": "string",
  "deptId": 0,
  "status": 0,
  "deleted": 0,
  "createTime": "2019-08-24T14:15:22Z",
  "updateTime": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||none|
|username|string|false|none||none|
|password|string|false|none||none|
|nickname|string|false|none||none|
|email|string|false|none||none|
|avatar|string|false|none||none|
|deptId|integer(int64)|false|none||none|
|status|integer(int32)|false|none||none|
|deleted|integer(int32)|false|none||none|
|createTime|string(date-time)|false|none||none|
|updateTime|string(date-time)|false|none||none|

