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

export const OrderList: React.FC<IResourceComponentsProps> = () => {
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


    let { data: serviceData, isLoading: serviceIsLoading } = useMany({
        resource: "service",
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.service?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows.data,
        },
    });

    let { data: userData, isLoading: hirerIsLoading } = useMany({
        resource: "profile",
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.hirer?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows.data,
        },
    });
 

    
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
    console.log("SERVICE DATA PROPS:::"+ JSON.stringify(serviceData));

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "id",
                headerName: translate("orders.fields.id"),
                type: "number",
                minWidth: 100,
                width: 100,
                align: "left",
                headerAlign: "left",
            },
            {
                field: "code",
                flex: 1,
                headerName: translate("orders.fields.code"),
                minWidth: 150,
            },
            {
                field: "date",
                flex: 1,
                headerName: translate("orders.fields.date"),
                minWidth: 140,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <DateField
                            value={row.date}
                            format="LL"
                            sx={{ fontSize: "14px" }}
                        />
                    );
                },
            },

            {
                field: "hirer",
                flex: 1,
                headerName: translate("orders.fields.hirer"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    const image = row.user.image ? config.IMAGE_URL+row.user.image : config.IMAGE_URL+"images/user/user_avatar.png";
                   
                    return (
                        <>
                        <img id={row.user._id}  width="25" height="25" className="rounded-full mr-1"  src={`${image}`} />
                        {row.user.firstName? row.user.firstName+" "+row.user.lastName : row.user.username} 
                        </>
                    );
                },
            },   
            {
                field: "service",
                flex: 1,
                headerName: translate("orders.fields.service"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        <span>{row.service.title} </span>
                        </>
                    );
                },
            },
            
            {
                field: "Earner",
                flex: 1,
                headerName: translate("orders.fields.earner"),
                minWidth: 180,
                resizable:  true,
                renderCell: function render({ row }) {
                    const image = row.service.user.image ? config.IMAGE_URL+row.service.user.image : config.IMAGE_URL+"images/user/user_avatar.png";
                   
                    return (
                        <>
                        <img id={row.service.user._id}  width="25" height="25" className="rounded-full mr-1"  src={`${image}`} />
                        {row.service.user.firstName? row.service.user.firstName+" "+row.service.user.lastName : row.service.user.username} 
                        </>
                    );
                },
            },
            {
                field: "delivery_date",
                flex: 1,
                headerName: translate("orders.fields.deliveryDate"),
                minWidth: 140,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <DateField
                            value={row.delivery_date}
                            format="LL"
                            sx={{ fontSize: "14px" }}
                        />
                    );
                },
            },
            {
                field: "subTotal",
                flex: 1,
                headerName: translate("orders.fields.subTotal"),
                minWidth: 50,
                resizable:  true,
            },
            {
                field: "serviceFee",
                flex: 1,
                headerName: translate("orders.fields.serviceFee"),
                minWidth: 50,
                resizable:  true,
            },
            {
                field: "amount",
                flex: 1,
                headerName: translate("orders.fields.amount"),
                minWidth: 50,
                resizable:  true,
            },
            {
                field: "status",
                flex: 1,
                headerName: translate("orders.fields.status"),
                minWidth: 100,
                resizable:  true,
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
        [translate,  userData?.data, serviceData?.data],
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
