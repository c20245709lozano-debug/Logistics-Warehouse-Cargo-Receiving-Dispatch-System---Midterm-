\# Logistics Warehouse Cargo Receiving \& Dispatch System (LWCRDS)



A Laravel and React-based warehouse cargo system for managing companies, cargo categories, warehouse bays, shipments, and billing statements.



\## Technology Stack



\- Laravel

\- PHP

\- React

\- TypeScript

\- Inertia.js

\- MySQL / MariaDB



\## Architecture



The application follows Laravel MVC with Form Requests for validation and Services for business logic.



```mermaid

flowchart TD

&#x20;   User(\[User])



&#x20;   Routes\["Routes<br/>routes/web.php"]



&#x20;   subgraph Controllers\["Controller Layer"]

&#x20;       CC\["CompanyController.php"]

&#x20;       CCC\["CargoCategoryController.php"]

&#x20;       WBC\["WarehouseBayController.php"]

&#x20;       SC\["ShipmentController.php"]

&#x20;       BSC\["BillingStatementController.php"]

&#x20;       DC\["DashboardController.php"]

&#x20;   end



&#x20;   subgraph Requests\["Form Request Validation Layer"]

&#x20;       SCR\["StoreCompanyRequest.php"]

&#x20;       UCR\["UpdateCompanyRequest.php"]

&#x20;       SCCR\["StoreCargoCategoryRequest.php"]

&#x20;       UCCR\["UpdateCargoCategoryRequest.php"]

&#x20;       SWBR\["StoreWarehouseBayRequest.php"]

&#x20;       UWBR\["UpdateWarehouseBayRequest.php"]

&#x20;       SSR\["StoreShipmentRequest.php"]

&#x20;       USR\["UpdateShipmentRequest.php"]

&#x20;   end



&#x20;   subgraph Services\["Service Layer"]

&#x20;       CS\["CompanyService.php"]

&#x20;       CCS\["CargoCategoryService.php"]

&#x20;       WBS\["WarehouseBayService.php"]

&#x20;       SS\["ShipmentService.php"]

&#x20;       BSS\["BillingStatementService.php"]

&#x20;       DS\["DashboardService.php"]

&#x20;   end



&#x20;   subgraph Models\["Eloquent Model Layer"]

&#x20;       Company\["Company.php"]

&#x20;       CargoCategory\["CargoCategory.php"]

&#x20;       WarehouseBay\["WarehouseBay.php"]

&#x20;       Shipment\["Shipment.php"]

&#x20;       BillingStatement\["BillingStatement.php"]

&#x20;   end



&#x20;   subgraph Database\["MySQL Database"]

&#x20;       Companies\[("companies")]

&#x20;       Categories\[("cargo\_categories")]

&#x20;       Bays\[("warehouse\_bays")]

&#x20;       Shipments\[("shipments")]

&#x20;       Statements\[("billing\_statements")]

&#x20;   end



&#x20;   User --> Routes

&#x20;   Routes --> CC

&#x20;   Routes --> CCC

&#x20;   Routes --> WBC

&#x20;   Routes --> SC

&#x20;   Routes --> BSC

&#x20;   Routes --> DC



&#x20;   CC --> SCR

&#x20;   CC --> UCR

&#x20;   CCC --> SCCR

&#x20;   CCC --> UCCR

&#x20;   WBC --> SWBR

&#x20;   WBC --> UWBR

&#x20;   SC --> SSR

&#x20;   SC --> USR



&#x20;   CC --> CS

&#x20;   CCC --> CCS

&#x20;   WBC --> WBS

&#x20;   SC --> SS

&#x20;   BSC --> BSS

&#x20;   DC --> DS



&#x20;   CS --> Company

&#x20;   CCS --> CargoCategory

&#x20;   WBS --> WarehouseBay

&#x20;   SS --> Shipment

&#x20;   BSS --> BillingStatement

&#x20;   DS --> Shipment

&#x20;   DS --> Company

&#x20;   DS --> CargoCategory

&#x20;   DS --> WarehouseBay

&#x20;   DS --> BillingStatement



&#x20;   Company --> Companies

&#x20;   CargoCategory --> Categories

&#x20;   WarehouseBay --> Bays

&#x20;   Shipment --> Shipments

&#x20;   BillingStatement --> Statements



&#x20;   Shipment --> Company

&#x20;   Shipment --> CargoCategory

&#x20;   Shipment --> WarehouseBay

&#x20;   BillingStatement --> Shipment

