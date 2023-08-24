import React from "react";
import {
    useDataGrid,
    EditButton,
    ShowButton,
    DeleteButton,
    List,
} from "@refinedev/mui";
import { DataGrid, GridColDef, GridColumns, GridToolbar, GridPagination, useGridApiContext, useGridSelector, gridPageCountSelector } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate, useNavigation} from "@refinedev/core";
import { useEffect, useMemo, useState } from 'react';


import MuiPagination from '@mui/material/Pagination';
import { TablePaginationProps } from '@mui/material/TablePagination';
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";


import config from "../../../utils/config";

export const UserList: React.FC<IResourceComponentsProps> = () => {

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
    const { pageSize, rows, onPageSizeChange, onPageChange} = dataGridProps;

    let data_grid = {
        data:{},
        count:0
    };
    if(dataGridProps.rows){ data_grid = dataGridProps.rows; }

    
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



    type StatusProps = {
        status?: "active" | "inactive" | "banned" | "admin";
    };

     const Status: React.FC<StatusProps> = ({ status }) => {
        const t = useTranslate();

        let color: ChipProps["color"];

        switch (status) {
            case "active":
                color = "success";
                break;
            case "inactive":
                color = "warning";
                break;
            case "banned":
                color = "error";
                break;
            case "admin":
                color = "info";
                break;
        }

        return (
            <Chip
                variant="outlined"
                size="small"
                color={color}
                label={t(`${status}`)}
            />
        );
    };


    const columns =  React.useMemo<GridColDef[]>(
        () => [
            {
                field: "id",
                headerName: translate("users.fields.id"),
                type: "number",
                minWidth: 100,
                width: 100,
                align: "left",
                headerAlign: "left",
            },

            {
                field: "username",
                headerName: translate("users.fields.username"),
                minWidth: 220,
                resizable:  true,
                renderCell: function render({ row }) {
                    const image = row.image ? config.IMAGE_URL+row.image : config.IMAGE_URL+"images/user/user_avatar.png";
                    return (
                        <>
                            <img id={row._id} width="25" height="25" className="rounded-full mr-1" src={`${image}`} />
                            <p>{row.username}</p>
                        </>
                    );
                },
            },
            {
                field: "firstName",
                headerName: translate("users.fields.name"),
                minWidth: 220,
                align: "left",
                headerAlign: "left",
                renderCell: function render({ row }) {
                    const image = row.image ? config.IMAGE_URL+row.image : config.IMAGE_URL+"images/user/user_avatar.png";
                    return (
                        <>
                             <p>{row.firstName} {row.lastName} </p>
                        </>
                    );
                },
            },
            {
                field: "email",
                headerName: translate("users.fields.email"),
                minWidth: 250,
                resizable:  true
            },
            {
                field: "balance",
                headerAlign: "right",
                align: "right",
                minWidth: 50,
                headerName: translate("users.fields.balance"),
                renderCell: function render({ row }) {
                    return (
                        <>
                            <strong>{row.balance} </strong>
                        </>
                    );
                },
            },
            {
                field: "wallet",
                flex: 1,
                minWidth: 450,
                headerName: translate("users.fields.wallet")
            },
           
            {
                field: "status",
                headerName: translate("users.fields.status"),
                headerAlign: "center",
                align: "center",
                minWidth: 100,
                renderCell: function render({ row }) {
                    return <Status status={row.status} />;
                },
            },
            {
                field: "actions",
                headerName: translate("table.actions"),
                sortable: false,
                align: "center",
                headerAlign: "center",
                minWidth: 50,
                renderCell: function render({ row }) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row._id} />
                            <ShowButton hideText recordItemId={row._id} />
                            <DeleteButton hideText recordItemId={row._id} />
                        </>
                    );
                },
            },
        ],
        [translate],
    );

    return (
        <List>
            <DataGrid {...dataGridProps} 

                    columns={columns} 
                    autoHeight 
                    density="compact"
                    rows={data_grid.data ? data_grid.data : {}}
                    rowCount={data_grid.count}
                    checkboxSelection
                    pageSize={pageSize}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[10, 15, 20, 50, 100]}
                    components={{Toolbar: GridToolbar, Pagination: CustomPagination}}
                />
        </List>
    );
};
