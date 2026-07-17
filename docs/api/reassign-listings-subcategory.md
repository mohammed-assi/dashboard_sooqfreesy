# Bulk-reassign ads to another subcategory

Admin endpoint to move many ads (listings) into a different subcategory in one
call. Use it from the dashboard after creating a new subcategory, when a batch
of existing ads should be re-bucketed.

`category_id` is **auto-synced** to the target subcategory's parent category, so
ads never end up category/subcategory inconsistent — the dashboard only needs to
send the ad IDs and the target subcategory.

---

## Endpoint

```
POST /api/admin/category/subcategory/reassign-listings
```

### Auth

Admin only. Send the admin access token:

```
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

A non-admin / missing token returns `400` (this API uses `400` for auth
failures, not `401/403`).

### Headers

| Header           | Value              | Notes                                            |
|------------------|--------------------|--------------------------------------------------|
| `Authorization`  | `Bearer <token>`   | Required, admin token.                            |
| `Content-Type`   | `application/json` | Body is JSON (not multipart).                     |
| `accept-language`| `en` \| `ar`       | Optional. Localizes `message`. Defaults to `en`.  |

---

## Request body

```jsonc
{
  "listingIds": [101, 102, 103],  // required: ads to move (any current subcategory)
  "toSubCategoryId": 34,          // required: the new subcategory for those ads
  "preview": true                 // optional: count only, no write (default false)
}
```

| Field             | Type       | Required | Rules                                              |
|-------------------|------------|----------|----------------------------------------------------|
| `listingIds`      | `number[]` | yes      | At least 1 item; each value ≥ 1.                    |
| `toSubCategoryId` | `number`   | yes      | ≥ 1. Must be an existing, non-deleted subcategory.  |
| `preview`         | `boolean`  | no       | `true` → dry-run (count, no changes).               |

> The ads' **current** subcategory is irrelevant — any selected ad is moved to
> `toSubCategoryId` regardless of where it is now.

---

## Response envelope

Every response uses this shape (HTTP status === `statusCode`):

```jsonc
{
  "success": true,
  "statusCode": 200,
  "message": "Ads moved to the new subcategory successfully.",
  "data": { },
  "error": undefined,
  "other": undefined
}
```

`message` is localized via the `accept-language` header.

### 1. Preview (dry-run) — `preview: true`

`200 OK`

```jsonc
{
  "success": true,
  "statusCode": 200,
  "message": "Subcategory preview",          // ar: "معاينة الفئة الفرعية"
  "data": { "count": 3 }                      // ads (of listingIds) that exist & will move
}
```

### 2. Commit — `preview` omitted/false

`200 OK`

```jsonc
{
  "success": true,
  "statusCode": 200,
  "message": "Ads moved to the new subcategory successfully.",
  "data": { "movedCount": 3 }                 // rows actually updated
}
```

### 3. Validation error (bad/missing body)

`400 Bad Request`

```jsonc
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "error": { "listingIds": "At least one ad is required" },  // field → message
  "data": {}
}
```

Other validation messages: `"Invalid ad ID"`, `"Target subcategory ID is required"`.

### 4. Target subcategory not found / deleted

`400 Bad Request` — `message`: `"Subcategory not found"` (key `subcategoryNotFound`).

### 5. Not authenticated / not admin

`400 Bad Request` — `message`: unauthorized / access-denied text.

### 6. Server error

`500` — `message`: internal server error text.

---

## Recommended dashboard flow

1. User selects a target subcategory and checks the ads to move (collect their
   IDs into `listingIds`).
2. **Call with `preview: true`** → show the user "`data.count` ads will be
   moved to <subcategory>" as a confirmation step.
3. On confirm, **call again without `preview`** → show
   "`data.movedCount` ads moved" on success (`success: true`).
4. Refresh the affected ad lists / subcategory counts.

### Notes for the frontend

- `movedCount` is the number of rows **actually updated**. If some IDs in
  `listingIds` don't exist, they're silently skipped — no error is returned.
  Compare `movedCount` against `listingIds.length` if you want to warn the user
  that some ads were not found.
- Treat the call as success only when `success === true`. On `success === false`,
  show `error` (object of field→message) if present, otherwise `message`.
- The operation is a single bulk DB update — safe and fast even for large
  `listingIds` batches.

---

## Examples

**Preview**

```bash
curl -X POST "https://<host>/api/admin/category/subcategory/reassign-listings" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "accept-language: en" \
  -d '{ "listingIds": [101,102,103], "toSubCategoryId": 34, "preview": true }'
```

**Commit**

```bash
curl -X POST "https://<host>/api/admin/category/subcategory/reassign-listings" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "listingIds": [101,102,103], "toSubCategoryId": 34 }'
```

---

## Implementation reference (for backend devs)

| Concern    | Location                                                        |
|------------|-----------------------------------------------------------------|
| Route      | `src/module/category/categoryRoute.ts` (`/subcategory/reassign-listings`) |
| Handler    | `src/module/category/categoryController.ts` → `reassignListingsSubCategory` |
| Validation | `src/middleware/validation/categoryValidation.ts` → `reassignListingsValidation` |
| Messages   | `src/helper/messagesTyes.ts` + `src/helper/messages.json` (`listingsReassignSuccess`) |
