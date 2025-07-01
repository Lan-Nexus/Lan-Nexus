# PageController Usage Guide

This document explains how to use the `PageController` abstract class in the project.

## Overview
`PageController` is an abstract base class for building CRUD (Create, Read, Update, Delete) controllers in an Express.js application. It provides a set of methods and hooks to handle common operations, view rendering, and error handling.

## Constructor
```
constructor(
  model: Model,
  SelectSchema: ZodSchema,
  InsertSchema: ZodSchema,
  UpdateSchema: ZodSchema,
)
```
- `model`: The data model instance (should implement `create`, `read`, `update`, `delete`, `list` methods).
- `SelectSchema`, `InsertSchema`, `UpdateSchema`: Zod schemas for validating request data.

## Static Properties
- `views`: Map of action names to view templates.
- `redirect`: Map of action names to redirect URLs or functions.
- `errorViews`: Map of HTTP status codes to error view templates.

## Main Methods
- `create(req, res)`: Handles creation of a new resource.
- `read(req, res)`: Reads a resource by ID.
- `list(req, res)`: Lists all resources.
- `update(req, res)`: Updates a resource by ID.
- `delete(req, res)`: Deletes a resource by ID.
- `renderCreateForm(req, res)`: Renders the create form.
- `renderUpdateForm(req, res)`: Renders the update form for a resource.

## Hooks (Override as Needed)
- `preCreate`, `postCreate`
- `preRead`, `postRead`
- `preList`, `postList`
- `preUpdate`, `postUpdate`
- `preDelete`, `postDelete`

Override these in your subclass to add custom logic before or after each operation.

## View Rendering
- If no `views` property is set, responses will be sent as JSON.
- Views are selected from the `views` static property based on the action.
- If a view name starts with `_`, it is rendered without a layout (i.e., `{ layout: false }` is passed to the renderer).
- Use `localRender` for custom rendering logic.

## Error Handling
- Use `sendStatus(res, status, error, data)` to send errors or render error views.
- Error views are selected from the `errorViews` static property.

## Example Subclass
```typescript
class MyController extends PageController {
  static views = {
    create: 'my/create',
    read: 'my/read',
    list: 'my/list',
    update: 'my/update',
    createForm: 'my/createForm',
    updateForm: 'my/updateForm',
  };

  // Optionally override hooks or mapRequestBody
}
```

## Customizing Request Body Mapping
Override `mapRequestBody(body, req, res)` to transform incoming data before validation.

---
For more details, see the code comments in `PageController.ts`.
