# Enhanced API Utilities Documentation

## Overview

The enhanced API utilities provide a more maintainable and type-safe approach to working with your portfolio API endpoints. This implementation follows senior development practices by separating concerns, reducing code duplication, and improving type safety.

## Architecture

### Core Principles

1. **Separation of Concerns**: Different functions for different operation types (GET, POST, Upload)
2. **Type Safety**: Leverages TypeScript for better development experience
3. **Code Reusability**: Factory functions and shared utilities reduce duplication
4. **Standardized Responses**: Consistent error handling and response formatting
5. **Backward Compatibility**: Original functions remain available

## API Functions

### Core Functions

#### `apiGet(endpoint: GetEndpoint)`
Specialized function for GET requests to entity endpoints.

```typescript
import { apiGet } from '@/lib/utils/api-enhanced';

// Fetch projects
const result = await apiGet("/api/Project");
if (result.ok) {
  console.log("Projects:", result.data);
} else {
  console.error("Error:", result.error);
}
```

#### `apiPost(endpoint: PostEndpoint, body: unknown, options?)`
Specialized function for POST requests with JSON payload.

```typescript
import { apiPost } from '@/lib/utils/api-enhanced';

const data = [{ slug: "test", title: "Test Project" }];
const result = await apiPost("/api/DataTransfer/projects", data);
```

#### `apiUpload(endpoint: PostEndpoint, formData: FormData, options?)`
Specialized function for file uploads with FormData.

```typescript
import { apiUpload } from '@/lib/utils/api-enhanced';

const formData = new FormData();
formData.append('files', file);
const result = await apiUpload("/api/DataTransfer/images", formData);
```

#### `dataTransferPost(endpoint: DataTransferEndpoint, data: unknown[], options?)`
Specialized function for data transfer operations with built-in validation.

```typescript
import { dataTransferPost } from '@/lib/utils/api-enhanced';

const skills = [{ name: "React" }, { name: "TypeScript" }];
const result = await dataTransferPost("/api/DataTransfer/skills", skills);
// Returns: { ok: boolean, data: { count: number }, error?: string }
```

### High-Level Wrappers

#### `entityApi`
Type-safe wrapper for entity endpoints.

```typescript
import { entityApi } from '@/lib/utils/api-enhanced';

// All these return ApiResponse<T>
const projects = await entityApi.projects();
const projectAssets = await entityApi.projectAssets();
const projectSkills = await entityApi.projectSkills();
const skills = await entityApi.skills();
```

#### `transferApi`
Type-safe wrapper for data transfer endpoints.

```typescript
import { transferApi } from '@/lib/utils/api-enhanced';

// Transfer different types of data
await transferApi.projects(projectData);
await transferApi.skills(skillData);
await transferApi.projectSkills(projectSkillData);
await transferApi.projectAssets(assetData);
await transferApi.images(formData);
```

### Utility Functions

#### `createTransferFunction()`
Factory function to create standardized transfer functions.

```typescript
import { createTransferFunction } from '@/lib/utils/api-enhanced';

const transferMyData = createTransferFunction(
  "/api/DataTransfer/projects",
  async () => {
    // Your data fetching logic
    const supabase = await createClient();
    return await supabase.from("articles").select("*");
  },
  (item) => ({
    // Your data transformation logic
    slug: item.slug,
    title: item.title,
    // ... other fields
  }),
  "projects" // Context for error messages
);

// Usage
const result = await transferMyData();
```

#### `apiBatch()`
Process multiple endpoints efficiently.

```typescript
import { apiBatch } from '@/lib/utils/api-enhanced';

const endpoints = ["/api/Project", "/api/Skill"] as const;
const results = await apiBatch(endpoints);

// Results is a record with endpoint as key
console.log(results["/api/Project"]);
console.log(results["/api/Skill"]);
```

## Type Definitions

### Response Types

```typescript
type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

type ApiErrorResponse = {
  ok: false;
  error: string;
  status: number;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type TransferResponse = ApiResponse<{ count: number; failed?: number }>;
```

### Endpoint Types

```typescript
type GetEndpoint = 
  | "/api/Project"
  | "/api/ProjectAsset"
  | "/api/ProjectSkill"
  | "/api/Skill";

type PostEndpoint = 
  | "/api/DataTransfer/images"
  | "/api/DataTransfer/projects"
  | "/api/DataTransfer/skills"
  | "/api/DataTransfer/project-skills"
  | "/api/DataTransfer/project-assets";
```

## Migration Guide

### From Original apiCall

**Before:**
```typescript
import { apiCall } from '@/lib/utils/api';

const result = await apiCall("/api/Project", { method: "GET" });
```

**After:**
```typescript
import { apiGet, entityApi } from '@/lib/utils/api-enhanced';

// Option 1: Direct function
const result = await apiGet("/api/Project");

// Option 2: High-level wrapper (recommended)
const result = await entityApi.projects();
```

### Enhanced Server Actions

**Before:**
```typescript
export async function transferProjectsToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*");

  if (error) {
    console.error("Error fetching articles:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const { ok, error: apiError, status } = await apiCall("/api/DataTransfer/projects", {
    method: "POST",
    body: data.map(/* transformation */),
    headers: { "Content-Type": "application/json" },
  });

  return { ok, error: apiError, status, data: { count: data.length } };
}
```

**After:**
```typescript
import { createTransferFunction } from '@/lib/utils/api-enhanced';

export const transferProjectsToApi = createTransferFunction(
  "/api/DataTransfer/projects",
  async () => {
    const supabase = await createClient();
    return await supabase.from("articles").select("*");
  },
  (article) => ({
    slug: article.slug,
    title: article.title,
    // ... transformation logic
  }),
  "projects"
);
```

## Error Handling

All enhanced functions return a standardized response format:

```typescript
const result = await entityApi.projects();

if (result.ok) {
  // Success case - data is available
  console.log("Data:", result.data);
} else {
  // Error case - error information available
  console.error("Error:", result.error);
  console.error("Status:", result.status);
}
```

## Best Practices

1. **Use high-level wrappers** (`entityApi`, `transferApi`) when possible
2. **Use factory functions** (`createTransferFunction`) for repetitive patterns
3. **Always handle both success and error cases**
4. **Prefer specialized functions** over generic `apiCall` for new code
5. **Keep original functions** for backward compatibility during migration

## Examples

### Complete Transfer Function Example

```typescript
// lib/server-actions/transfer-skills-enhanced.ts
import { createClient } from "@/lib/supabase/server";
import { createTransferFunction } from "@/lib/utils/api-enhanced";

export const transferSkillsToApi = createTransferFunction(
  "/api/DataTransfer/skills",
  async () => {
    const supabase = await createClient();
    return await supabase.from("skills").select("name");
  },
  (skill) => ({
    name: skill.name,
    createdAt: new Date().toISOString(),
  }),
  "skills"
);
```

### Batch Health Check Example

```typescript
// Check all entity endpoints
const endpoints = ["/api/Project", "/api/ProjectAsset", "/api/ProjectSkill", "/api/Skill"] as const;
const results = await apiBatch(endpoints);

// Report health status
for (const [endpoint, result] of Object.entries(results)) {
  if (result.ok) {
    console.log(`✅ ${endpoint}: ${Array.isArray(result.data) ? result.data.length : 'OK'} items`);
  } else {
    console.log(`❌ ${endpoint}: ${result.error}`);
  }
}
```

## Performance Benefits

1. **Reduced bundle size**: Specialized functions include only necessary logic
2. **Better tree shaking**: Import only what you need
3. **Improved caching**: Consistent response format enables better caching strategies
4. **Type inference**: Better TypeScript performance with explicit types

## Testing

The enhanced utilities are designed to be easily testable:

```typescript
// Mock the enhanced API functions
jest.mock('@/lib/utils/api-enhanced', () => ({
  entityApi: {
    projects: jest.fn(),
  },
  transferApi: {
    projects: jest.fn(),
  },
}));
```

For more examples, see the demonstration page at `/check-transfer-enhanced`.