FLOWCHART TD
    User([User])
    Routes["Routes<br/>routes/web.php"]

    subgraph Controllers["Controller Layer"]
        CC["CompanyController.php"]
        CCC["CargoCategoryController.php"]
        WBC["WarehouseBayController.php"]
        SC["ShipmentController.php"]
        BSC["BillingStatementController.php"]
        DC["DashboardController.php"]
    end

    subgraph Requests["Form Request Validation Layer"]
        SCR["StoreCompanyRequest.php"]
        UCR["UpdateCompanyRequest.php"]
        SCCR["StoreCargoCategoryRequest.php"]
        UCCR["UpdateCargoCategoryRequest.php"]
        SWBR["StoreWarehouseBayRequest.php"]
        UWBR["UpdateWarehouseBayRequest.php"]
        SSR["StoreShipmentRequest.php"]
        USR["UpdateShipmentRequest.php"]
    end

    subgraph Services["Service Layer"]
        CS["CompanyService.php"]
        CCS["CargoCategoryService.php"]
        WBS["WarehouseBayService.php"]
        SS["ShipmentService.php"]
        BSS["BillingStatementService.php"]
        DS["DashboardService.php"]
    end

    subgraph Models["Eloquent Model Layer"]
        Company["Company.php"]
        CargoCategory["CargoCategory.php"]
        WarehouseBay["WarehouseBay.php"]
        Shipment["Shipment.php"]
        BillingStatement["BillingStatement.php"]
    end

    subgraph Database["MySQL / MariaDB Database"]
        Companies[("companies")]
        Categories[("cargo_categories")]
        Bays[("warehouse_bays")]
        Shipments[("shipments")]
        Statements[("billing_statements")]
    end

    User --> Routes
    Routes --> CC
    Routes --> CCC
    Routes --> WBC
    Routes --> SC
    Routes --> BSC
    Routes --> DC

    SCR --> CC
    UCR --> CC
    SCCR --> CCC
    UCCR --> CCC
    SWBR --> WBC
    UWBR --> WBC
    SSR --> SC
    USR --> SC

    CC --> CS
    CCC --> CCS
    WBC --> WBS
    SC --> SS
    BSC --> BSS
    DC --> DS

    CS --> Company
    CCS --> CargoCategory
    WBS --> WarehouseBay
    SS --> Shipment
    SS --> WarehouseBay
    SS --> BillingStatement
    BSS --> BillingStatement
    BSS --> Shipment
    DS --> Shipment
    DS --> Company
    DS --> CargoCategory
    DS --> WarehouseBay
    DS --> BillingStatement

    Company --> Companies
    CargoCategory --> Categories
    WarehouseBay --> Bays
    Shipment --> Shipments
    BillingStatement --> Statements

    Shipment -->|sender / receiver| Company
    Shipment --> CargoCategory
    Shipment --> WarehouseBay
    Shipment --> BillingStatement
    BillingStatement --> Shipment