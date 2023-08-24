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

export const ResolutionList: React.FC<IResourceComponentsProps> = () => {
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
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.hirer?.id) ?? [],
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

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "id",
                headerName: translate("resolutions.fields.id"),
                type: "number",
                minWidth: 100,
                width: 100,
                align: "left",
                headerAlign: "left",
            },
            {
                field: "date",
                flex: 1,
                headerName: translate("resolutions.fields.date"),
                minWidth: 180,
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
                field: "user",
                flex: 1,
                headerName: translate("reviews.fields.user"),
                minWidth: 200,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        <img id={row.user._id}  width="25" height="25" className="rounded-full mr-1"  src={`${config.IMAGE_URL}${row.user.image}`} />
                        {row.user.firstName} {row.user.lastName}
                        </>
                    );
                },
            },   
            {
                field: "order",
                flex: 1,
                headerName: translate("resolutions.fields.order"),
                minWidth: 150,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        <span>{row.order?.code} </span>
                        </>
                    );
                },
            },
            {
                field: "complaint",
                flex: 1,
                headerName: translate("resolutions.fields.complaint"),
                minWidth: 150,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                        <>
                        <span>{row.complaint?.name} </span>
                        </>
                    );
                },
            },
            {
                field: "message",
                flex: 1,
                headerName: translate("resolutions.fields.message"),
                minWidth: 400,
            },
            {
                field: "status",
                flex: 1,
                headerName: translate("resolutions.fields.status"),
                minWidth: 120,
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
