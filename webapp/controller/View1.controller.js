sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.customerlist.controller.View1", {
            onInit: function () {

                var oJsonModel = new sap.ui.model.json.JSONModel({
                    mtablemode: "display",
                    customerResults: []
                });

                this.getView().setModel(oJsonModel, "ViewModel");
                var oModel = this.getOwnerComponent().getModel();
                
                oModel.read("/Customers", {
                    success: function (oData) {
                        // debugger;
                        
                        if(oData.results.length > 0 ) {
                            var aColumnData = [];
                            var aKeys = Object.keys(oData.results[0]);
                            for (let index = 0; index < aKeys.length; index++) {                            
                                if(typeof(oData.results[0][aKeys[index]]) === 'string') {
                                    aColumnData.push({
                                        colProperty:aKeys[index]
                                    });
                                }
                            }
                        
                        // typeof(oData.results[0][Object.keys(oData.results[0])[1]])
                        // var aColumnData = [
                        //     {
                        //         columnName: "Customer ID",
                        //         colProperty: "CustomerID"
                        //     },
                        //     {
                        //         columnName: "Company Name",
                        //         colProperty: "CompanyName"
                        //     },
                        //     {
                        //         columnName: "Contact Name",
                        //         colProperty: "ContactName"
                        //     },
                        //     {
                        //         columnName: "Contact Title",
                        //         colProperty: "ContactTitle"
                        //     },
                        //     {
                        //         columnName: "Address",
                        //         colProperty: "Address"
                        //     },
                        //     {
                        //         columnName: "Phone",
                        //         colProperty: "Phone"
                        //     }
                        // ];
                        debugger;
                        this.getView().getModel("ViewModel").setProperty("/customerResults", oData.results);
                        this.rebindTable("display");
                        this.rebindDynamicTable(aColumnData);
                    }
                    }.bind(this),
                    error: function (oError) {

                    }.bind(this)
                });

            },
            rebindTable: function (smode) {
                var oTable = this.getView().byId("CustomersTable");
                if (smode === "display") {
                    var oColumnListItem = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "{ViewModel>CustomerID}"
                            }),
                            new sap.m.Text({
                                text: "{ViewModel>CompanyName}"
                            }),
                            new sap.m.Text({
                                text: "{ViewModel>ContactName}"
                            }),
                            new sap.m.Text({
                                text: "{ViewModel>ContactTitle}"
                            }),
                            new sap.m.Text({
                                text: "{ViewModel>Address}"
                            }),
                            new sap.m.Text({
                                text: "{ViewModel>Phone}"
                            })
                        ]
                    });
                } else {
                    var oColumnListItem = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Input({
                                value: "{ViewModel>CustomerID}"
                            }),
                            new sap.m.Input({
                                value: "{ViewModel>CompanyName}"
                            }),
                            new sap.m.Input({
                                value: "{ViewModel>ContactName}"
                            }),
                            new sap.m.Input({
                                value: "{ViewModel>ContactTitle}"
                            }),
                            new sap.m.Input({
                                value: "{ViewModel>Address}"
                            }),
                            new sap.m.Input({
                                value: "{ViewModel>Phone}"
                            })
                        ]
                    });
                }
                oTable.bindAggregation("items", {
                    path: "ViewModel>/customerResults",
                    template: oColumnListItem
                });
            },
            rebindDynamicTable: function (arr) {
                var oTable = this.getView().byId("CustomersTableDynamic");
                var aCells = [];
                for (let index = 0; index < arr.length; index++) {
                    var oColumn = new sap.m.Column({
                        header: new sap.m.Text({
                            text: arr[index].colProperty
                        })
                    });
                    oTable.addColumn(oColumn);                 
                    var oText = new sap.m.Text({
                        text: "{ViewModel>" + arr[index].colProperty + "}"
                    });
                    aCells.push(oText);

                }
                var oColumnListItem = new sap.m.ColumnListItem({
                    cells:aCells
                });

                oTable.bindAggregation("items", {
                    path: "ViewModel>/customerResults",
                    template: oColumnListItem
                });
            },
            onEditSavePress: function (oEvt) {
                if (oEvt.getSource().getText() === "Edit") {
                    this.getView().getModel("ViewModel").setProperty("/mtablemode", "edit");
                    this.rebindTable("edit");
                    this.getView().byId("AddRowBtn").setVisible(true);
                } else {
                    this.getView().getModel("ViewModel").setProperty("/mtablemode", "display");
                    this.rebindTable("display");
                    this.getView().byId("AddRowBtn").setVisible(false);

                }
            },
            onAddRowPress: function () {
                var oObject = {
                    CustomerID: "",
                    CompanyName: "",
                    ContactName: "",
                    ContactTitle: "",
                    Address: "",
                    Phone: ""
                };
                var aData = this.getView().getModel("ViewModel").getProperty("/customerResults");
                aData.unshift(oObject);
                this.getView().getModel("ViewModel").setProperty("/customerResults", aData);
            }
        });
    });



