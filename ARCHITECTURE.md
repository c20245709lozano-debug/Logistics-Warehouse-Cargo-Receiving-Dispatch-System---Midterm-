# LWCRDS Architecture

## Services Layer

The Logistics Warehouse Cargo Receiving & Dispatch System (LWCRDS) uses a service layer to separate business logic from HTTP controllers.

### 1. Company Service
- **File:** `app/Services/CompanyService.php`
- **Controller:** `app/Http/Controllers/CompanyController.php`
- **Model:** `app/Models/Company.php`
- **Responsibility:** Company management operations.

### 2. Cargo Category Service
- **File:** `app/Services/CargoCategoryService.php`
- **Controller:** `app/Http/Controllers/CargoCategoryController.php`
- **Model:** `app/Models/CargoCategory.php`
- **Responsibility:** Cargo category operations.

### 3. Warehouse Bay Service
- **File:** `app/Services/WarehouseBayService.php`
- **Controller:** `app/Http/Controllers/WarehouseBayController.php`
- **Model:** `app/Models/WarehouseBay.php`
- **Responsibility:** Warehouse bay operations and capacity validation.

### 4. Shipment Service
- **File:** `app/Services/ShipmentService.php`
- **Controller:** `app/Http/Controllers/ShipmentController.php`
- **Models:** `app/Models/Shipment.php`, `app/Models/WarehouseBay.php`, `app/Models/BillingStatement.php`
- **Responsibility:** Shipment creation and updates, warehouse capacity checks, storage-fee calculations, and billing statement updates.

## Request Flow

React/Inertia interface → Controller → Service → Model → Database

Controllers handle incoming requests and responses. Services handle business operations, models interact with database records, and the React/Inertia interface displays application pages.