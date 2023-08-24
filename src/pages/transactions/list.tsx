import React from "react";
import {
    useDataGrid,
    EditButton,
    ShowButton,
    DeleteButton,
    List,
    DateField,
} from "@refinedev/mui";
import { DataGrid, GridColumns, GridToolbar, GridPagination, useGridApiContext, useGridSelector, gridPageCountSelector } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate, useMany } from "@refinedev/core";
import { useEffect, useMemo, useState } from 'react';


import MuiPagination from '@mui/material/Pagination';
import { TablePaginationProps } from '@mui/material/TablePagination';

import config from "../../../utils/config";

export const TransactionList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    

    const { dataGridProps } = useDataGrid({
        initialPageSize: 15,
        sorters: {
            initial: [
                {
                    field: "id",
                    order: "desc",
                },
            ],
        },
    }); 
    const {
        pageSize,
        rows,
        onPageSizeChange,
        onPageChange,
    } = dataGridProps;


    let data_grid = {};
    if(dataGridProps.rows){ data_grid = dataGridProps.rows; 
    }else{ dataGridProps.rows = {}}


    let { data: userData, isLoading: userIsLoading } = useMany({
        resource: "profile",
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.sender?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows.data,
        },
    });

    let { data: orderData, isLoading: orderIsLoading } = useMany({
        resource: "order",
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.order?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows.data,
        },
    });

    const oj = {};
    oj._id = 0;
    oj.image="images/logo_mark.png";
    oj.firstName="Ourjobs Escrow";
    oj.lastName="";

    
    function Pagination({
        page,
        onPageChange,
        className,
      }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
        const apiRef = useGridApiContext();
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);
      
        return (
          <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
              onPageChange(event as any, newPage - 1);
            }}
          />
        );
      }
      
      function CustomPagination(props: any) {
        return <GridPagination ActionsComponent={Pagination} {...props} />;
      }

    //alert(JSON.stringify(dataGridProps));
    console.log("DATA GRID PROPS:::"+ JSON.stringify(dataGridProps));
    console.log("USER DATA PROPS:::"+ JSON.stringify(userData));

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "id",
                headerName: translate("transactions.fields.id"),
                type: "number",
                minWidth: 100,
                width: 100,
                align: "left",
                headerAlign: "left",
            },
            {
                field: "code",
                flex: 1,
                headerName: translate("transactions.fields.code"),
                minWidth: 130,
            },
            {
                field: "date",
                flex: 1,
                headerName: translate("transactions.fields.date"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <DateField
                            value={row.date}
                            format="LLL"
                            sx={{ fontSize: "14px" }}
                        />
                    );
                },
            },
            {
                field: "sender",
                flex: 1,
                headerName: translate("transactions.fields.sender"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        {row.type=="send" ? 
                        <>
                        <img id={row.user._id}  width="25" height="25" className="rounded-full mr-1"  src={`${config.IMAGE_URL}${row.user.image}`} />
                        {row.user.firstName} {row.user.lastName}
                        </>
                        : 
                        <>
                         <img id={oj._id}  width="25" height="25" className="rounded-full mr-1"  src={`http://localhost:5173/${oj.image}`} />
                            {oj.firstName} {oj.lastName}
                        </>
                        }
                        </>
                    );
                },
            },   
            {
                field: "receiver",
                flex: 1,
                headerName: translate("transactions.fields.receiver"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        {row.type=="receive" ? 
                        <>
                        <img id={row.user._id}  width="25" height="25" className="rounded-full mr-1"  src={`${config.IMAGE_URL}${row.user.image}`} />
                        {row.user.firstName} {row.user.lastName}
                        </>
                        : 
                        <>
                         <img id={oj._id}  width="25" height="25" className="rounded-full mr-1"  src={`http://localhost:5173/${oj.image}`} />
                            {oj.firstName} {oj.lastName}
                        </>
                        }
                        </>
                    );
                },
            },   
            
            {
                field: "amount",
                flex: 1,
                headerName: translate("transactions.fields.amount"),
                minWidth: 50,
            },
            {
                field: "crypto",
                flex: 1,
                headerName: translate("transactions.fields.crypto"),
                minWidth: 50,
            },
            {
                field: "chain",
                flex: 1,
                headerName: translate("transactions.fields.chain"),
                minWidth: 50,
            },
            {
                field: "order",
                flex: 1,
                headerName: translate("transactions.fields.order"),
                minWidth: 150,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        <span>{row.order.code} </span>
                        </>
                    );
                },
            },
            
            {
                field: "reference",
                flex: 1,
                headerName: translate("transactions.fields.reference"),
                minWidth: 150,
            },
            {
                field: "status",
                flex: 1,
                headerName: translate("transactions.fields.status"),
                minWidth: 100,
            },
            {
                field: "actions",
                headerName: translate("table.actions"),
                sortable: false,
                renderCell: function render({ row }) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row._id} />
                            <ShowButton hideText recordItemId={row._id} />
                            <DeleteButton hideText recordItemId={row._id} />
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 80,
            },
        ],
        [translate, userData?.data, orderData?.data],
    );

    return (
        <List>
            <DataGrid {...dataGridProps} 

                    columns={columns} 
                    autoHeight 
                    density="compact"
                    rows={data_grid.data ? data_grid.data : {}}
                    rowCount={data_grid.count}
                    //onColumnSortChange={alert("dert")}

                    checkboxSelection
                    disableSelectionOnClick
                    pageSize={pageSize}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[10, 15, 20, 50, 100]}
                    components={{Toolbar: GridToolbar, Pagination: CustomPagination}}
                />
        </List>
    );
};
