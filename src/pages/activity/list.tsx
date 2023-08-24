import React from "react";
import {
    useDataGrid,
    EditButton,
    ShowButton,
    DeleteButton,
    List,
    DateField,
} from "@refinedev/mui";
import { DataGrid, GridColDef, GridColumns, GridToolbar, GridPagination, useGridApiContext, useGridSelector, gridPageCountSelector } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate, useMany } from "@refinedev/core";
import { useEffect, useMemo, useState } from 'react';

import MuiPagination from '@mui/material/Pagination';
import { TablePaginationProps } from '@mui/material/TablePagination';

import config from "../../../utils/config";

export const ActivityList: React.FC<IResourceComponentsProps> = () => {
    
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


    
    let { data: categoryData, isLoading: categoryIsLoading } = useMany({
        resource: "category",
        ids: dataGridProps?.rows?.data?.map((item: any) => item?.category?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows.data,
        },
    });

    let { data: userData, isLoading: userIsLoading } = useMany({
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

    console.log("DATA GRID PROPS:::"+ JSON.stringify(dataGridProps));
    console.log("CATEGORY DATA PROPS:::"+ JSON.stringify(categoryData));


    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "id",
                headerName: translate("activity.fields.id"),
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
                field: "log",
                flex: 1,
                headerName: translate("activity.fields.notification"),
                minWidth: 450,
                resizable:  true,
                renderCell: function render({ row }) {
                    return (
                    <>
                        <img src={`${config.IMAGE_URL}${row.icon}`}  width="25" height="25" className="rounded-full mr-1"  />
                        {row.log}
                    </>
                    );
                },
            },
            {
                field: "module",
                flex: 1,
                headerName: translate("activity.fields.module"),
                minWidth: 100,
                resizable:  true,
            },
            {
                field: "moduleId",
                flex: 1,
                headerName: translate("activity.fields.moduleId"),
                minWidth: 100,
                resizable:  true,
            },
            {
                field: "action",
                flex: 1,
                headerName: translate("activity.fields.action"),
                minWidth: 100,
                resizable:  true,
            },
            {
                field: "ip",
                flex: 1,
                headerName: translate("activity.fields.ip"),
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
        [translate, userData?.data],
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
