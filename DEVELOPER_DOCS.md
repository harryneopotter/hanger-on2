# Developer Documentation

This document outlines the initial project structure, components, API endpoints, and developer tools configured as part of the project setup.

## Project Structure

The following key directories and files have been created or modified:

*   `lib/services/`: Contains service classes for interacting with data (e.g., `GarmentService`, `ImageService`, `TagService`).
*   `lib/validation/`: Contains Zod schemas for data validation (e.g., `schemas.ts`).
*   `components/ui/`: Contains reusable UI primitive components (e.g., `SearchBar`).
*   `components/features/`: Contains components with business logic related to specific features (e.g., `GarmentCard`, `GarmentForm`, `GarmentGrid`, `TagInput`, `TagList`, `TagFilter`, `ImageUpload`, `ImageCropper`, `ImageGallery`, `FilterPanel`).
*   `app/api/garments/`: Contains API routes for garment operations (`route.ts`, `[id]/route.ts`).
*   `app/api/images/`: Contains API routes for image operations (`route.ts`).
*   `app/api/tags/`: Contains API routes for tag operations (`route.ts`).

## Created Components

The following React components have been created with basic structure and styling:

*   `TagInput`
*   `TagList`
*   `TagFilter`
*   `ImageUpload`
*   `ImageCropper`
*   `ImageGallery`
*   `SearchBar` (moved from `app/page.tsx`)
*   `FilterPanel`
*   `GarmentForm`
*   `GarmentGrid`

## Defined API Endpoints

The following API endpoints have been outlined with basic request handling structure. Note that the implementation of the service layer calls and actual data handling is still required.

*   `GET /api/garments`: To fetch all garments.
*   `POST /api/garments`: To create a new garment.
*   `GET /api/garments/[id]`: To fetch a specific garment by ID.
*   `PUT /api/garments/[id]`: To update an existing garment by ID.
*   `DELETE /api/garments/[id]`: To delete a garment by ID.
*   `POST /api/images`: To handle image uploads.
*   `GET /api/tags`: To fetch all tags.
*   `POST /api/tags`: To create new tags.

## Configured Developer Tools

The following developer experience tools have been configured:

*   **ESLint:** Configured with stricter TypeScript rules for code linting.
*   **Prettier:** Configured with basic formatting rules and added `format` and `check-format` npm scripts.
*   **TypeScript:** Strict mode and related flags enabled in `tsconfig.json`.
